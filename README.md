# MercuryDash: On-Demand Delivery Platform

MercuryDash is a full-stack application built with React and Manifest, simulating a food and goods delivery service like DoorDash. It connects customers, drivers, and restaurant owners in a seamless, role-based platform.

## Core Features

- **Role-Based Authentication**: Users can sign up as a Customer, Driver, or Restaurant Owner, each with a unique dashboard experience.
- **Customer Experience**: Customers can browse restaurants, view menus with photos and prices, and place orders.
- **Driver Portal**: Drivers can view available deliveries, accept jobs, and update the order status as they progress from pickup to delivery.
- **Restaurant Management**: Owners can manage their restaurant profile, add/edit/delete menu items (including photos and pricing), and view and accept incoming orders.
- **Real-Time Status Updates**: Orders progress through various statuses (`Pending`, `Accepted`, `Out for Delivery`, `Delivered`), providing clarity to all parties.
- **Dynamic UI**: The frontend is built with React and Tailwind CSS for a modern, responsive user experience.
- **Manifest Backend**: The entire backend, including database, API, authentication, and file storage, is powered by a single `manifest.yml` file.

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS
- **Backend**: Manifest
- **SDK**: `@mnfst/sdk` for all frontend-backend communication

## Getting Started

1.  **Run the Backend**: Deploy the application via the Manifest platform.
2.  **Install Frontend Dependencies**: `npm install`
3.  **Run the Frontend**: `npm run dev`
4.  **Access the App**: Open your browser to `http://localhost:5173`.

## Admin Panel

An auto-generated admin panel is available at `/admin` on your deployed backend URL. You can manage all users, restaurants, menu items, and orders directly from this interface.

- **Default Admin User**: `admin@manifest.build`
- **Default Password**: `admin`
