<!DOCTYPE html>
<html lang="en">
<head>
    <title>BGOAT</title>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
<!--ewww so much bootstrap-->
    <link rel="stylesheet" href="bootstrap.css">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha2/dist/css/bootstrap.min.css" rel="stylesheet"
          integrity="sha384-aFq/bzH65dt+w6FI2ooMVUpc+21e0SRygnTpmBvdBgSdnuTN7QbdgL+OapgHtvPp" crossorigin="anonymous">
</head>
<body>
<!--if you solve it by going thrrough the sourcecode then what's the meaning? of this challenge-->
<?php
//you are not gonna have the source code in real life, so hack it without going through the files man!!
if (isset($_POST['password']) && $_POST['password'] == "falconethics") {
//    probably the worst way to write php
    echo '
    <div class="list">
    <nav class="navbar bg-body-tertiary">
        <h1 class="navbar-brand mb-0 h1" >🫰 BEST FPS GAMES OF ALL TIMES</h1> 
    </nav>
      <div>
        <div class="list-item Assassins-Creed-Trilogy"></div>
      </div>
      <div>
        <div class="list-item Call-Of-Duty"></div>
      </div>
      <div>
        <div class="list-item Grand-Theft-Auto"></div>
      </div>
      <div>
        <div class="list-item Fantasy"></div>
      </div>
      <div>
        <div class="list-item World-War-Trilogy"></div>
      </div>
      <div>
        <div class="list-item Survival"></div>
      </div>
      <div>
        <div class="list-item Modern-Combat"></div>
      </div>
      <div>
        <div class="list-item Assassins-Creed-Aftermath"></div>
      </div>
      <div>
        <div class="list-item Comical"></div>
      </div>
      <div>
        <div class="list-item Medieval"></div>
      </div>
      <div>
        <div class="list-item Secret-Service"></div>
      </div>
      <div>
        <div class="list-item Medal-of-Honor"></div>
      </div>
      <div>
        <div class="list-item Futuristic"></div>
      </div>
      <div>
        <div class="list-item Super-Natural"></div>
      </div>
      <div>
        <div class="list-item Horror"></div>
      </div>
      <div>
        <div class="list-item Others"></div>
      </div>
      <a class="btn btn-outline-warning dc" href="https://discord.gg/qkcm8qGP8b">Join this Elite group of Gamers</a>
    </div>';
    echo '<script>';
    echo 'document.getElementById("passwordSection").style.display = "none";';
    echo '</script>';
} else {
    echo '<div id="passwordSection" class="input-group mb-3">';
    echo '<img src="./board.png" alt="board" />';
    echo '<form class="items" method="post" action="' . $_SERVER['PHP_SELF'] . '">';
    echo '<label class="items" for="password">WHO`S THE FALL GUYS ?</label>';
    echo '<input class="form-control" type="password" id="password" name="password">';
    echo '<input class="btn btn-outline-light" type="submit" value=" ☠ SUBMIT NAME">';
    echo '</form>';
    echo '</div>';
}
?>
<!--quite confusing isn't it-->
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.3/jquery.min.js"></script>
<script src="jQuery.js"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha2/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-qKXV1j0HvMUeCBQ+QVp7JcfGl760yU08IQ+GpUo5hlbpg51QRiuqHAJz8+BrxE/N"
        crossorigin="anonymous"></script>
</body>
</html>
