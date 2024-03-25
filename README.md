# Project Description

Welcome to our University Timetable Management System! This system is designed to efficiently handle the complexities of organizing class schedules within our educational institution. With a focus on security, data integrity, and user-friendly interfaces, our platform offers a seamless experience for students, faculty, and administrative staff.

# Functional Requirements:  
  
1.User Roles and Authentication:  
- Users will have designated roles such as students, faculty, and administrative staff, each with their own set of permissions.  
- Secure authentication mechanisms will be implemented to ensure only authorized users can access the system.  

2.Course Management:  
- The system enables faculty members to create, modify, and manage course details including course codes, titles, descriptions, and prerequisites.  
- Course schedules can be easily viewed and updated by authorized personnel.  

3.Timetable Management:  
- Users can view class schedules and timetables, including details like course timings, instructors, and locations.  
- The system supports the creation and modification of timetables, ensuring efficient allocation of resources and avoiding scheduling conflicts.  

4.Room and Resource Booking:  
- Faculty and staff can reserve rooms and other resources (such as projectors or laboratories) for classes, meetings, and events.  
- The system provides real-time availability status and prevents double bookings.  

5.Student Enrollment:  
- Students can enroll in courses through the system, with validation checks to ensure prerequisites are met and no scheduling conflicts occur.  
- Waitlist functionality is available to manage oversubscribed courses.  

6.Notifications and Alerts:  
- The system sends notifications and alerts to users for important events such as upcoming classes, room changes, or enrollment deadlines.  
- Users can customize their notification preferences based on their role and preferences.  

# Technical Implementation:  
Our system will be developed as a RESTful API, utilizing modern web technologies to ensure scalability, security, and ease of integration with other systems. 
Data will be stored securely and redundantly, with appropriate encryption and access controls in place. We will prioritize user experience, with intuitive 
interfaces and responsive design to ensure accessibility across various devices.

  
# Getting Started with Project

To get started with the project, follow these steps:

1. Clone the Repository: Clone the project repository to your local machine using the following command:
    - git clone <repository_url> 
2. Install Dependencies: Open a terminal within the project directory and run the following command to install all dependencies:
    - npm install 
3. Run Backend Server: Start the backend server by running the following command in the terminal:
    - npm run dev
4. Run Frontend Server: Open a new terminal and navigate to the frontend directory within the project directory using the following command:
    - cd frontend
5. Then, run the following command to start the frontend server:
    - npm run dev
6. Access the Application: Open a web browser and go:
    -  http://localhost:5173/
7. Login: You can log in as an admin, faculty, or student using the provided credentials.
8. With these steps, you should now be able to run the project locally and access it through your web browser.

# API Documentation

You can access the API documentation for our University Timetable Management System through Postman. Please follow these steps to view the documentation:

1. Open Postman and ensure you are logged in.
2. Import the provided collection of APIs.
3. Once imported, you can explore the available endpoints, request methods, and parameters.
4. Each API endpoint is documented with details such as its purpose, expected input parameters, and sample responses.
5. Test the APIs directly within Postman to familiarize yourself with their functionality.

# Unit Testing with Jest

You can also check the backend part using Jest for unit testing. Run individual test files using the following command:  
- npm test filename.test.js
