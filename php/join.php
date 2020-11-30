<?php
    include '../php/database.php';

    // Connect to SQL database
    $connection = mysqli_connect($server, $username, $password, $database);

    // Check for connection error
    if (mysqli_connect_error()) {
        echo "Failed to connect to MYSQL: " . mysql_connect_error();
        die();
    }

    $roomNumber = $_POST['roomID'];
    $userID = $_POST['userID'];

    // When roomNumber is -1 a new room must be created else joined
    if ($roomNumber == -1)
        $query = "INSERT INTO Rooms (UserA) VALUES ('{$userID}')";
    else
        $query = "UPDATE Rooms SET UserB='{$userID}' WHERE ID='{$roomNumber}'";
    mysqli_query($connection, $query);

    // When a new room is created, find and respond with the id of that room
    if ($roomNumber == -1) {
        $query = "SELECT * FROM Rooms WHERE ID=(SELECT max(ID) FROM Rooms)";
        $results = mysqli_query($connection, $query);
        $row = mysqli_fetch_array($results);
        $roomNumber = $row['ID'];
        echo $roomNumber;
    }

    mysqli_close($connection);
?>