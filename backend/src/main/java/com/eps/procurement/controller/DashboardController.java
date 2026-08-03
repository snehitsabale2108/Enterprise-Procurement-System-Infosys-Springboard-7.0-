package com.eps.procurement.controller;

import com.eps.procurement.service.DashboardService;
import java.util.Map;
import org.springframework.web.bind.annotation.*;

/** Role-specific dashboard endpoints: /api/dashboard/** */
@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboards;

    public DashboardController(DashboardService dashboards) {
        this.dashboards = dashboards;
    }

    @GetMapping("/employee")
    public Map<String, Object> employee(@RequestParam String userId) {
        return dashboards.employee(userId);
    }

    @GetMapping("/manager")
    public Map<String, Object> manager(@RequestParam(required = false) String department) {
        return dashboards.manager(department);
    }

    @GetMapping("/senior-manager")
    public Map<String, Object> seniorManager() {
        return dashboards.seniorManager();
    }

    @GetMapping("/head")
    public Map<String, Object> head() {
        return dashboards.head();
    }

    @GetMapping("/procurement")
    public Map<String, Object> procurement() {
        return dashboards.procurement();
    }

    @GetMapping("/finance")
    public Map<String, Object> finance() {
        return dashboards.finance();
    }

    @GetMapping("/admin")
    public Map<String, Object> admin() {
        return dashboards.admin();
    }
}
