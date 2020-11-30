<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chat Application</title>
    <link rel="stylesheet" href="../css/style.css">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <script src="../javascript/script.js"></script>
</head>
<body onload=setUpdates()>
    <div class="login-text" id="login-text">
        <header>
            <h1>Chat Application</h1>
        </header>
    </div>
    <div class="open-chats">
        <h3>Current Chat Rooms</h3>
    </div>

    <div class="chat-area" id='room-area'></div>
    <div class="chat-content" id='chat-area'></div>
    <div class="messages" id='message-area'></div>

    <div class="login" id="login-header">
        <header>
            <h3> Login </h3>
        </header>

        <form action="../javascript/script.js" method="post" id='login-form' onsubmit="return false;">
            <input type="text" name="username" id='login-username' placeholder="Username">
            <input type="password" name="password" id='login-password' placeholder="Password">
            <input type="submit" id='loginButton' value="Submit" onClick="login()">
        </form>
    </div>
</body>
</html>