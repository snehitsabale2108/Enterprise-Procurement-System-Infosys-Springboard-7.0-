package com.procurement.controller;

import com.procurement.dao.UserDAO;
import com.procurement.model.UserRole;

public class LoginController {

    public static void main(String[] args) {
        UserDAO userDAO = new UserDAO();
        UserRole user = userDAO.getUserRole("test@company.com", "hashed_password_here");

        if (user != null) {
            switch (user.getRoleName()) {
                case "Employee" -> System.out.println("Load Employee Dashboard");
                case "Manager" -> System.out.println("Load Manager Dashboard");
                case "Senior Manager" -> System.out.println("Load Senior Manager Dashboard");
                case "Head" -> System.out.println("Load Head Dashboard");
                case "Procurement Officer" -> System.out.println("Load Procurement Dashboard");
                case "Finance Officer" -> System.out.println("Load Finance Dashboard");
                case "Admin" -> System.out.println("Load Admin Dashboard");
            }
        } else {
            System.out.println("Invalid login");
        }
    }
}