<table id='chats'><tbody id='chats-body'>
<?php
    include "../php/database.php";

    $connection = mysqli_connect($server, $username, $password, $database);

    // Check for connection error
    if (mysqli_connect_error()) 
        echo "Failed to connect to MYSQL: " . mysql_connect_error();

    // Get UserID and RoomID
    $userID = $_POST['userID'];
    $roomID = $_POST['roomID'];

    // If roomID is -1 then the user is making a new room
    // Update the roomID to the currently created room
    if ($roomID == -1) {
        $query = "SELECT ID FROM Rooms WHERE UserA='{$userID}'";
        $results = mysqli_query($connection, $query);
        $row = mysqli_fetch_array($results);
        $roomID = $row['ID'];
    }

    // Fetch both users' id from room
    $query = "SELECT * FROM Rooms WHERE ID='{$roomID}'";
    $results = mysqli_query($connection, $query);
    $row = mysqli_fetch_array($results);

    $owner = $row['UserA'];
    $guest = $row['UserB'];

    // Fetch both users' names from room
    $query = "SELECT Username FROM Users WHERE UserID='{$owner}'";
    $results = mysqli_query($connection, $query);
    $row = mysqli_fetch_array($results);
    $ownerName = $row['Username'];

    $query = "SELECT Username FROM Users WHERE UserID='{$guest}'";
    $results = mysqli_query($connection, $query);
    $row = mysqli_fetch_array($results);
    $guestName = $row['Username'];

    $query = "SELECT * FROM Messages WHERE UserID='{$owner}' OR UserID='{$guest}' ORDER BY MessageID";
    $results = mysqli_query($connection, $query);
    while($row = mysqli_fetch_array($results)) :
        // Set HTML separately - only way it would work properly
?>
        <?php 
            if ($row['UserID'] == $owner) 
                if ($owner == $userID)
                    echo "<tr class='user-messages'><td><p><span class='owner-chat'><b>" . "You" . "</b></span>: " . $row['Message'] . "</p></td></tr>";
                else
                    echo "<tr class='user-messages'><td><p><span class='owner-chat'><b>" . $ownerName . "</b></span>: " . $row['Message'] . "</p></td></tr>";
            else
                if ($guest == $userID)
                    echo "<tr class='user-messages'><td><p><span class='guest-chat'><b>" . "You" . "</b></span>: " . $row['Message'] . "</p></td></tr>";
                else
                    echo "<tr class='user-messages'><td><p><span class='guest-chat'><b>" . $guestName . "</b></span>: " . $row['Message'] . "</p></td></tr>";
            ?>
<?php 
    endwhile;
    mysqli_close($connection);
?>
</tbody></table>