package com.eps.procurement;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.ArrayList;
import java.util.List;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

/**
 * End-to-end backend workflow tests.
 *
 * <p>Covers the full procurement lifecycle plus the two policy guarantees:
 * role-based (department-scoped) vendor selection / PO processing, and
 * category integrity (a laptop can only be raised as Equipment &amp; Assets → Laptop).
 * Every step also asserts the audit trail entries that must be written.
 */
@SpringBootTest
@AutoConfigureMockMvc
@TestMethodOrder(MethodOrderer.MethodName.class)
class WorkflowE2ETest {

    private static final String EMPLOYEE = "U001";          // Ravi Kumar, employee
    private static final String EQUIPMENT_TEAM = "U007";    // Rajesh Patel, equipment_team
    private static final String SOFTWARE_TEAM = "U008";     // Kavita Joshi, software_team
    private static final String FACILITIES_TEAM = "U009";   // Arun Gupta, facilities_team
    private static final String CENTRAL = "U006";           // Deepa Nair, procurement_officer
    private static final String FINANCE = "U010";           // Lakshmi Iyer, finance_officer

    @Autowired MockMvc mvc;
    @Autowired ObjectMapper json;

    private JsonNode call(org.springframework.test.web.servlet.RequestBuilder builder, int expectedStatus)
            throws Exception {
        MvcResult result = mvc.perform(builder).andReturn();
        assertThat(result.getResponse().getStatus())
                .as(result.getResponse().getErrorMessage() + " " + result.getResponse().getContentAsString())
                .isEqualTo(expectedStatus);
        String body = result.getResponse().getContentAsString();
        return body == null || body.isBlank() ? json.createObjectNode() : json.readTree(body);
    }

    private JsonNode postJson(String url, String body, int status) throws Exception {
        return call(post(url).contentType(MediaType.APPLICATION_JSON).content(body), status);
    }

    private List<String> auditActions(String requestId) throws Exception {
        JsonNode trail = call(get("/api/audit-trail/requests/" + requestId), 200);
        List<String> actions = new ArrayList<>();
        trail.forEach(node -> actions.add(node.get("action").asText()));
        return actions;
    }

    private String createLaptopRequest() throws Exception {
        JsonNode created = postJson("/api/requests", """
            {"title":"Dell Latitude Laptop","description":"Replacement laptop","reason":"Old device",
             "category":"Equipment & Assets","subcategory":"Laptop","quantity":1,"estimatedCost":45000,
             "department":"Engineering","requiredDate":"2026-09-30","createdBy":"%s","priority":"high"}
            """.formatted(EMPLOYEE), 201);
        return created.get("id").asText();
    }

    // ── 1. Category integrity ────────────────────────────────
    @Test
    void t01_laptopCannotBeRaisedUnderAnotherCategory() throws Exception {
        JsonNode error = postJson("/api/requests", """
            {"title":"MacBook Pro 14","description":"Dev laptop","reason":"New joiner",
             "category":"Facilities","subcategory":"Furniture","quantity":1,"estimatedCost":180000,
             "department":"Engineering","requiredDate":"2026-09-30","createdBy":"%s"}
            """.formatted(EMPLOYEE), 422);
        assertThat(error.toString()).contains("Equipment & Assets");

        // The rejection is audited.
        JsonNode rejections = call(get("/api/audit-trail")
                .param("action", "request_category_rejected"), 200);
        assertThat(rejections.get("totalElements").asInt()).isGreaterThan(0);
    }

    @Test
    void t02_classifyEndpointSuggestsMandatoryCategory() throws Exception {
        JsonNode suggestion = call(get("/api/requests/classify").param("title", "Lenovo ThinkPad laptop"), 200);
        assertThat(suggestion.get("category").asText()).isEqualTo("Equipment & Assets");
        assertThat(suggestion.get("subcategory").asText()).isEqualTo("Laptop");
    }

    @Test
    void t03_editingARequestIntoAnIllegalCategoryIsRejected() throws Exception {
        String requestId = createLaptopRequest();
        MvcResult result = mvc.perform(put("/api/requests/" + requestId)
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"category\":\"Software & Digital Services\",\"subcategory\":\"Software License\"}"))
                .andReturn();
        assertThat(result.getResponse().getStatus()).isEqualTo(422);
    }

    // ── 2. Return for correction keeps the draft editable ────
    @Test
    void t04_returnedRequestIsEditableAndResubmittable() throws Exception {
        String requestId = createLaptopRequest();
        call(patch("/api/requests/" + requestId + "/submit"), 200);

        JsonNode returned = postJson("/api/approvals/" + requestId + "/return",
                "{\"comments\":\"Add a quote\",\"approverRole\":\"manager\"}", 200);
        assertThat(returned.get("newStatus").asText()).isEqualTo("returned");
        assertThat(returned.get("editable").asBoolean()).isTrue();

        call(put("/api/requests/" + requestId).contentType(MediaType.APPLICATION_JSON)
                .content("{\"description\":\"Quote attached\"}"), 200);
        JsonNode resubmitted = call(patch("/api/requests/" + requestId + "/submit"), 200);
        assertThat(resubmitted.get("status").asText()).isEqualTo("pending_manager");

        assertThat(auditActions(requestId))
                .contains("request_created", "request_submitted", "request_returned",
                        "request_updated", "request_resubmitted");
    }

    // ── 3. Department-scoped sourcing, award and PO processing ─
    @Test
    void t05_fullLifecycleWithRoleBasedPermissions() throws Exception {
        String requestId = createLaptopRequest();
        call(patch("/api/requests/" + requestId + "/submit"), 200);
        JsonNode approved = postJson("/api/approvals/" + requestId + "/approve",
                "{\"comments\":\"ok\",\"approverRole\":\"manager\"}", 200);
        assertThat(approved.get("newStatus").asText()).isEqualTo("approved");

        // The IT/software team may not source an Equipment & Assets request.
        postJson("/api/rfqs?actorId=" + SOFTWARE_TEAM, """
            {"requestId":"%s","supplierId":"S001","itemName":"Dell Latitude Laptop","quantity":1,
             "category":"Equipment & Assets","submissionDeadline":"2026-09-01"}
            """.formatted(requestId), 403);

        // The equipment team may.
        JsonNode rfq = postJson("/api/rfqs?actorId=" + EQUIPMENT_TEAM, """
            {"requestId":"%s","supplierId":"S001","itemName":"Dell Latitude Laptop","quantity":1,
             "category":"Equipment & Assets","submissionDeadline":"2026-09-01"}
            """.formatted(requestId), 201);
        String rfqId = rfq.get("id").asText();

        JsonNode quotation = postJson("/api/quotations", """
            {"rfqId":"%s","requestId":"%s","supplierId":"S001","unitPrice":44000,"totalAmount":44000,
             "estimatedDeliveryTime":"7 days","warranty":"3 years","validUntil":"2026-10-01"}
            """.formatted(rfqId, requestId), 201);
        String quotationId = quotation.get("id").asText();
        assertThat(quotation.get("financeStatus").asText()).isEqualTo("pending_finance");

        // Vendor cannot be awarded before finance clears the quotation.
        postJson("/api/quotations/" + quotationId + "/select",
                "{\"actorId\":\"" + EQUIPMENT_TEAM + "\"}", 409);

        JsonNode reviewed = postJson("/api/quotations/" + quotationId + "/finance-review",
                "{\"approve\":true,\"comments\":\"Within budget\",\"reviewedBy\":\"" + FINANCE + "\"}", 200);
        assertThat(reviewed.get("financeStatus").asText()).isEqualTo("approved");

        // Facilities team cannot award an equipment request.
        postJson("/api/quotations/" + quotationId + "/select",
                "{\"actorId\":\"" + FACILITIES_TEAM + "\"}", 403);

        JsonNode award = postJson("/api/quotations/" + quotationId + "/select",
                "{\"actorId\":\"" + EQUIPMENT_TEAM + "\",\"deliveryDate\":\"2026-09-20\"}", 200);
        String poId = award.get("purchaseOrder").get("id").asText();
        assertThat(award.get("purchaseOrder").get("ownerTeam").asText()).isEqualTo("equipment_team");
        assertThat(award.get("purchaseOrder").get("status").asText()).isEqualTo("sent");

        // Illegal PO transition (sent → delivered) is rejected and audited.
        postJson("/api/purchase-orders/" + poId + "/process",
                "{\"status\":\"delivered\",\"actorId\":\"" + EQUIPMENT_TEAM + "\"}", 409);

        // Wrong department cannot process the PO.
        postJson("/api/purchase-orders/" + poId + "/process",
                "{\"status\":\"accepted\",\"actorId\":\"" + SOFTWARE_TEAM + "\"}", 403);

        // Designated department team processes it through the state machine.
        for (String stage : List.of("accepted", "in_transit", "delivered")) {
            JsonNode step = postJson("/api/purchase-orders/" + poId + "/process",
                    "{\"status\":\"" + stage + "\",\"actorId\":\"" + EQUIPMENT_TEAM
                            + "\",\"remarks\":\"stage " + stage + "\"}", 200);
            assertThat(step.get("purchaseOrder").get("status").asText()).isEqualTo(stage);
        }
        // Central procurement may close any category.
        JsonNode closed = postJson("/api/purchase-orders/" + poId + "/process",
                "{\"status\":\"closed\",\"actorId\":\"" + CENTRAL + "\"}", 200);
        assertThat(closed.get("purchaseOrder").get("status").asText()).isEqualTo("closed");

        JsonNode request = call(get("/api/requests/" + requestId), 200);
        assertThat(request.get("status").asText()).isEqualTo("completed");
        assertThat(request.get("selectedSupplierId").asText()).isEqualTo("S001");

        // ── Audit trail assertions ──
        List<String> actions = auditActions(requestId);
        assertThat(actions).contains("request_created", "request_submitted", "request_approved",
                "rfq_created", "quotation_submitted", "quotation_finance_approved", "vendor_selected",
                "po_created", "po_accepted", "po_in_transit", "po_delivered", "po_closed",
                "po_transition_rejected");

        // Newest-first ordering.
        JsonNode trail = call(get("/api/audit-trail/requests/" + requestId), 200);
        List<String> timestamps = new ArrayList<>();
        trail.forEach(node -> timestamps.add(node.get("timestamp").asText()));
        assertThat(timestamps).isSortedAccordingTo((a, b) -> b.compareTo(a));
        assertThat(trail.get(0).get("action").asText()).startsWith("po_");

        // Per-entity trails.
        JsonNode poTrail = call(get("/api/purchase-orders/" + poId + "/audit-trail"), 200);
        assertThat(poTrail.size()).isGreaterThanOrEqualTo(5);
        JsonNode quotationTrail = call(get("/api/audit-trail/quotation/" + quotationId), 200);
        assertThat(quotationTrail.size()).isGreaterThanOrEqualTo(2);
        JsonNode rfqTrail = call(get("/api/audit-trail/rfq/" + rfqId), 200);
        assertThat(rfqTrail.size()).isGreaterThanOrEqualTo(1);
        JsonNode awardTrail = call(get("/api/audit-trail")
                .param("entity", "vendor_award").param("entityId", requestId), 200);
        assertThat(awardTrail.get("totalElements").asInt()).isEqualTo(1);
    }

    @Test
    void t06_departmentTeamOnlySeesItsOwnPurchaseOrders() throws Exception {
        JsonNode facilities = call(get("/api/purchase-orders").param("actorId", FACILITIES_TEAM), 200);
        facilities.get("content").forEach(po -> {
            String category = po.get("category").isNull() ? null : po.get("category").asText();
            if (category != null) {
                assertThat(category).isEqualTo("Facilities");
            }
        });
        JsonNode central = call(get("/api/purchase-orders").param("actorId", CENTRAL), 200);
        assertThat(central.get("totalElements").asInt())
                .isGreaterThanOrEqualTo(facilities.get("totalElements").asInt());
    }
}
