-- Crear la base de datos
CREATE DATABASE EventBookingDB;
GO

USE EventBookingDB;
GO

-- Tabla de Roles
CREATE TABLE Roles (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(50) NOT NULL UNIQUE,
    description NVARCHAR(255)
);

-- Insertar roles básicos
INSERT INTO Roles (name, description) VALUES 
    ('admin', 'Administrador del sistema'),
    ('user', 'Usuario cliente');

-- Tabla de Usuarios
CREATE TABLE Users (
    id INT IDENTITY(1,1) PRIMARY KEY,
    first_name NVARCHAR(50) NOT NULL,
    last_name NVARCHAR(50) NOT NULL,
    email NVARCHAR(255) NOT NULL UNIQUE,
    password NVARCHAR(255) NOT NULL,
    role_id INT NOT NULL,
    profile_image NVARCHAR(MAX),
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE(),
    CONSTRAINT FK_Users_Roles FOREIGN KEY (role_id) REFERENCES Roles(id)
);

-- Tabla de Eventos
CREATE TABLE Events (
    id INT IDENTITY(1,1) PRIMARY KEY,
    date DATE NOT NULL,
    capacity INT NOT NULL DEFAULT 20,
    available_spots INT NOT NULL DEFAULT 20,
    is_full BIT NOT NULL DEFAULT 0,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE()
);

-- Tabla de Reservaciones
CREATE TABLE Reservations (
    id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL,
    event_id INT NOT NULL,
    status NVARCHAR(20) DEFAULT 'pending',
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE(),
    CONSTRAINT FK_Reservations_Users FOREIGN KEY (user_id) REFERENCES Users(id),
    CONSTRAINT FK_Reservations_Events FOREIGN KEY (event_id) REFERENCES Events(id)
);