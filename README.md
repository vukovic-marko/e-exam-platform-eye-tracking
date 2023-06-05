
# Web-based E-Exam Platform with Eye Tracking Support

### Description:

This project is a web application designed for conducting e-exams with eye tracking capabilities. It leverages the MERN stack (MongoDB, Express.js, React, and Node.js) for implementation. The eye tracking functionality is achieved by integrating the [GazePointer app](https://gazerecorder.com/gazepointer/) into the platform.

### Key Features:

 - Teacher Features:
	 -  Create exams 
	 - Set points of interest for eye tracking software 
	 - View exam results 
     - Analyze eye tracking data through informative charts and graphics 
- Student Features: 
	- Take exams 
	- View exam results

### Required Software:

Make sure you have the following software installed before running the project:
- [Node.js](https://nodejs.org/en) - JavaScript runtime environment
- [Yarn](https://yarnpkg.com/) - Dependency manager for Node.js
- [MongoDB](https://www.mongodb.com/try/download/community) - NoSQL database for storing application data
- [GazePointer](https://gazerecorder.com/gazepointer/) - Eye tracking software for capturing eye movements

### Installation:

1. Clone the repository.
2. Change directory to the backend app: `cd backend`.
3. Install dependencies by running: `yarn`.
4. Create a .env file for environment variables.
5. Start the backend app: `yarn start`.
6. Change directory to the frontend app: `cd frontend`.
7. Install dependencies by running: `yarn`.
8. Start the frontend app: `yarn start`.
9. Download and start the GazePointer app.
10. The app is now running at http://localhost:3000.

### Environment Variables:

To configure the behavior of the app, you can set the following environment variables:

    PORT: The port on which the backend app listens (e.g., 5000).
    DB_CONNECTION: The location of the database (e.g., mongodb://dbUser:dbPass@localhost:27017/test).
    ACCESS_TOKEN_SECRET: The secret used for signing and verifying the access token signature.
    ACCESS_TOKEN_EXPIRES_IN: The lifespan of the access token (e.g., 1h for one hour, 7d for seven days).
    REFRESH_TOKEN_SECRET: The secret used for signing and verifying the refresh token signature.
    REFRESH_TOKEN_EXPIRES_IN: The lifespan of the refresh token (e.g., 30d for 30 days).

Make sure to set these environment variables according to your specific setup and requirements. You can either set them directly in your deployment environment or create a .env file in the backend app directory and define the variables there.

For example, you can create a .env file in the backend directory and add the following content:

	PORT=5000
	DB_CONNECTION=mongodb://dbUser:dbPass@localhost:27017/test
	ACCESS_TOKEN_SECRET=QnaXFnbREkmQ65SvS/k3dkF1WuwDVbpVmJDW2Sd0nTr+AgX2c18EVpn5B/D/if4WWbG/Gl3AfSVqYAO1JlZQB3jUUMfPuF+FXQhHyp7DpsG4XqjCVZTtdamdlgBPTSdpQoirkQRG6t+5zT92KOPS+ffvPyLwtwYe1yG2PZrXoTxCWLDgfnzt9UapXUGIf757C5lEoUgPtPOYgGmjlzlKUKQ8RsbqtGBMxDIhh0nxbofAhkf4zSYm24DciwqaT+eUtP9+8/+7MrHHS6KFOiTwQpJ0jQ4Jl75+WyZrhxn+lWTweZ0QHU6pyOE/hJ76MFeg3Heto5uDUS0JcDPRs27+jQ==
	REFRESH_TOKEN_SECRET=3ZHu5PfIbegwphGB4vPBlFA4hg9ofvmVcCKKQJJ9UgEjHdU4Xhhhko4nQPySiYjkOUXJ7dKhHtcLBM3kydhBnrnt6k884ikHQgI7Rq7MJveMwqfzi426p9nivpCmIpy2GoRURAGTshTLsk+0vQpEnmmjPNg5pK1hEHwqO7EhpcUpuxmgPXGfStfORsh11vvOyyBdySWQUDSHR25Th2/opYf8EtUYo8qq6pOa3ojnSor+akEVIldCOqSHssFgUb+avwrpgf2xpvUHxc1Mfop+9GQpj+m0bceBEv4jMbxcJGByPcC/aTsiWHrPg0HbDUcWiyBM3BaVD5v/uClChtcqmQ==
	ACCESS_TOKEN_EXPIRES_IN=20m
	REFRESH_TOKEN_EXPIRES_IN=7d

Additional Information:
For more detailed information about the project, please refer to the accompanying paper.
