package com.eps.procurement.policy;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Procurement policy — pure rules, no state. Mirrors the frontend policy module
 * (src/store/procurementPolicy.js) so the same guarantees hold server side:
 *
 * <ol>
 *   <li>Item classification: a laptop can only ever be raised under
 *       Equipment &amp; Assets → Laptop (and likewise for other known items).</li>
 *   <li>Department routing: which team owns a category and may therefore source,
 *       award and process purchase orders for it.</li>
 *   <li>The purchase order state machine.</li>
 * </ol>
 */
public final class ProcurementPolicy {

    private ProcurementPolicy() {}

    // ── 1. Item classification ───────────────────────────────
    public record ItemRule(String key, List<String> keywords, String category, String subcategory) {}

    public static final List<ItemRule> ITEM_RULES = List.of(
        new ItemRule("laptop", List.of("laptop", "macbook", "notebook pc", "thinkpad", "ideapad", "ultrabook", "chromebook"), "Equipment & Assets", "Laptop"),
        new ItemRule("desktop", List.of("desktop", "workstation", "all-in-one pc", "tower pc", "imac"), "Equipment & Assets", "Desktop"),
        new ItemRule("monitor", List.of("monitor", "ultrasharp", "display panel"), "Equipment & Assets", "Monitor"),
        new ItemRule("keyboard", List.of("keyboard"), "Equipment & Assets", "Keyboard"),
        new ItemRule("mouse", List.of("mouse", "trackpad"), "Equipment & Assets", "Mouse"),
        new ItemRule("headset", List.of("headset", "headphone", "earphone"), "Equipment & Assets", "Headset"),
        new ItemRule("webcam", List.of("webcam"), "Equipment & Assets", "Webcam"),
        new ItemRule("dock", List.of("docking station", "dock hub"), "Equipment & Assets", "Docking Station"),
        new ItemRule("license", List.of("license", "licence"), "Software & Digital Services", "Software License"),
        new ItemRule("saas", List.of("subscription", "saas"), "Software & Digital Services", "SaaS Subscription"),
        new ItemRule("cloud", List.of("cloud credits", "cloud service", "aws ", "azure", "gcp"), "Software & Digital Services", "Cloud Service"),
        new ItemRule("furniture", List.of("chair", "desk", "table", "furniture", "cabinet", "workbench"), "Facilities", "Furniture"),
        new ItemRule("renovation", List.of("renovation", "remodel", "civil work", "interior work"), "Facilities", "Renovation"),
        new ItemRule("repairs", List.of("repair", "servicing", "maintenance visit"), "Facilities", "Repairs"),
        new ItemRule("cleaning", List.of("cleaning", "housekeeping", "sanitiser", "sanitizer"), "Facilities", "Cleaning Supplies")
    );

    /** The classification rule an item title falls under, or {@code null}. */
    public static ItemRule classifyItem(String title) {
        String haystack = " " + (title == null ? "" : title.toLowerCase()) + " ";
        for (ItemRule rule : ITEM_RULES) {
            for (String keyword : rule.keywords()) {
                if (haystack.contains(keyword)) {
                    return rule;
                }
            }
        }
        return null;
    }

    public static ItemRule suggestCategory(String title) {
        return classifyItem(title);
    }

    /**
     * Validates the category/subcategory chosen for an item title.
     *
     * @return {@code null} when the combination is legal, otherwise a human readable reason.
     */
    public static String validateItemCategory(String title, String category, String subcategory) {
        ItemRule rule = classifyItem(title);
        if (rule == null) {
            return null;
        }
        boolean sameCategory = rule.category().equalsIgnoreCase(category == null ? "" : category.trim());
        boolean sameSubcategory = rule.subcategory().equalsIgnoreCase(subcategory == null ? "" : subcategory.trim());
        if (sameCategory && sameSubcategory) {
            return null;
        }
        return "\"" + (title == null ? "" : title.trim()) + "\" is a " + rule.subcategory().toLowerCase()
                + " item. It must be raised under " + rule.category() + " -> " + rule.subcategory()
                + " (selected: " + (category == null || category.isBlank() ? "-" : category) + " -> "
                + (subcategory == null || subcategory.isBlank() ? "-" : subcategory) + ").";
    }

    // ── 2. Department routing ────────────────────────────────
    public static final Map<String, String> CATEGORY_TEAMS = Map.of(
        "Equipment & Assets", "equipment_team",
        "Software & Digital Services", "software_team",
        "Facilities", "facilities_team"
    );

    public static final Map<String, String> TEAM_LABELS;
    static {
        Map<String, String> labels = new LinkedHashMap<>();
        labels.put("equipment_team", "Equipment Team");
        labels.put("software_team", "IT / Software Team");
        labels.put("facilities_team", "Facilities Team");
        labels.put("procurement_officer", "Central Procurement");
        labels.put("admin", "Administrator");
        TEAM_LABELS = Map.copyOf(labels);
    }

    public static final List<String> DEPARTMENT_TEAM_ROLES =
            List.of("equipment_team", "software_team", "facilities_team");

    /** Roles that may process every category. */
    public static final List<String> CENTRAL_ROLES = List.of("procurement_officer", "admin");

    public static String teamForCategory(String category) {
        if (category == null) {
            return "procurement_officer";
        }
        return CATEGORY_TEAMS.getOrDefault(category.trim(), "procurement_officer");
    }

    public static String teamLabel(String role) {
        return TEAM_LABELS.getOrDefault(role, role);
    }

    /**
     * Central procurement handles everything; a department team only handles the
     * category it is designated for (IT → software, Facilities → facilities,
     * Equipment → equipment).
     */
    public static boolean canProcessCategory(String role, String category) {
        if (role == null) {
            return false;
        }
        return CENTRAL_ROLES.contains(role) || teamForCategory(category).equals(role);
    }

    public static String categoryDenialReason(String role, String category) {
        return teamLabel(role) + " is not designated for " + category + ". "
                + teamLabel(teamForCategory(category)) + " or central procurement must process it.";
    }

    // ── 3. Purchase order state machine ─────────────────────
    public static final Map<String, List<String>> PO_FLOW;
    static {
        Map<String, List<String>> flow = new LinkedHashMap<>();
        flow.put("draft", List.of("sent", "cancelled"));
        flow.put("sent", List.of("accepted", "cancelled"));
        flow.put("accepted", List.of("in_transit", "cancelled"));
        flow.put("in_transit", List.of("delivered"));
        flow.put("delivered", List.of("closed"));
        flow.put("closed", List.of());
        flow.put("cancelled", List.of());
        PO_FLOW = Map.copyOf(flow);
    }

    public static final List<String> PO_STAGE_ORDER =
            List.of("draft", "sent", "accepted", "in_transit", "delivered", "closed");

    public static List<String> nextPoStatuses(String status) {
        return PO_FLOW.getOrDefault(status == null ? "" : status.toLowerCase(), List.of());
    }

    public static boolean canTransitionPo(String from, String to) {
        return to != null && nextPoStatuses(from).contains(to.toLowerCase());
    }
}
