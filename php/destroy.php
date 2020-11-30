<?php
    include "../php/database.php";

    $connection = mysqli_connect($server, $username, $password, $database);

    // Check for connection error
    if (mysqli_connect_error()) 
        echo "Failed to connect to MYSQL: " . mysql_connect_error();

    // Get room id
    $roomID = $_REQUEST['roomID'];

    // Get users from room id
    $query = "SELECT * FROM Rooms WHERE ID='{$roomID}'";
    $results = mysqli_query($connection, $query);
    $row = mysqli_fetch_array($results);

    $userA = $row['UserA'];
    $userB = $row['UserB'];

    // Remove all chats from users in a room
    $query = "DELETE FROM Messages WHERE UserID='{$userA}' OR UserID='{$userB}'";
    mysqli_query($connection, $query);

    // Remove the room itself
    $query = "DELETE FROM Rooms WHERE ID = '{$roomID}'";
    mysqli_query($connection, $query);
    header("Refresh:0");
    mysqli_close($connection);

?>