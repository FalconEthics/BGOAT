<!DOCTYPE html>
<html lang="en">
<head>
    <title>BGOAT</title>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-aFq/bzH65dt+w6FI2ooMVUpc+21e0SRygnTpmBvdBgSdnuTN7QbdgL+OapgHtvPp" crossorigin="anonymous">
    <style>
        body {
            animation: 1s ease-out 0s 1 fadeIn;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            /*text-align: center;*/
            min-height: 100vh;
            background-image: url("https://wallpapers.com/images/hd/detective-paraphernalia-high-definition-e02vnxp0clzrizfj.jpg");
            background-size: auto;
        }
        @keyframes fadeIn {
            0% {
                opacity: 0;
            }
            100% {
                opacity: 1;
            }
        }
        input{
            margin-top: 10px;
            width: 270px;

        }
        label{
            width: 270px;
            color: azure;
            background: #4D3B11;
            background: -webkit-linear-gradient(right, #4D3B11, #F97B71);
            background: -moz-linear-gradient(right, #4D3B11, #F97B71);
            background: linear-gradient(to left, #4D3B11, #F97B71);
            padding: 5px;
            border-radius: 10px;
        }
        h3{
            margin-top: 10px;
            color: azure;
        }
        nav{
            border-radius: 8px;
        }
        h1{
            padding: 15px;
        }
        .list{
            margin: 50px;
        }
        div{
            margin-top: 40px;
        }
    </style>
</head>
<body>
<?php
if (isset($_POST['password']) && $_POST['password'] == "falconethics") {
    echo '  <div class="list">
  <nav class="navbar bg-body-tertiary">
        <h1 class="navbar-brand mb-0 h1" >🫰 BEST FPS GAMES OF ALL TIMES</h1> 
</nav>
      <div>
        <div class="Assassins-Creed-Trilogy"></div>
      </div>
      <div>
        <div class="Call-Of-Duty"></div>
      </div>
      <div>
        <div class="Grand-Theft-Auto"></div>
      </div>
      <div>
        <div class="Fantasy"></div>
      </div>
      <div>
        <div class="World-War-Trilogy"></div>
      </div>
      <div>
        <div class="Survival"></div>
      </div>
      <div>
        <div class="Modern-Combat"></div>
      </div>
      <div>
        <div class="Assassins-Creed-Aftermath"></div>
      </div>
      <div>
        <div class="Comical"></div>
      </div>
      <div>
        <div class="Medieval"></div>
      </div>
      <div>
        <div class="Secret-Service"></div>
      </div>
      <div>
        <div class="Medal-of-Honor"></div>
      </div>
      <div>
        <div class="Futuristic"></div>
      </div>
      <div>
        <div class="Super-Natural"></div>
      </div>
      <div>
        <div class="Horror"></div>
      </div>
      <div>
        <div class="Others"></div>
      </div>
    </div>';
    echo '<script>';
    echo 'document.getElementById("passwordSection").style.display = "none";';
    echo '</script>';
} else {
    echo '<div id="passwordSection input-group mb-3">';
    echo '<form class="items" method="post" action="' . $_SERVER['PHP_SELF'] . '">';
    echo '<label class="items" for="password">WHO`S THE FALL GUYS ?</label>';
    echo '<input class="form-control" type="password" id="password" name="password">';
    echo '<input class="btn btn-outline-light" type="submit" value=" ☠ SUBMIT NAME">';
    echo '</form>';
    echo '</div>';
}
?>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.3/jquery.min.js"></script>
<script>
    $(document).ready(function () {
        var fileNames = ['ACT.txt', 'COD.txt', 'GTA.txt', 'fantasy.txt', 'WWT.txt', 'survival.txt', 'MC.txt', 'ACM.txt', 'comical.txt', 'medieval.txt', 'SS.txt', 'MOH.txt', 'futuristic.txt', 'SN.txt', 'horror.txt', 'others.txt'];
        var classNames = ['Assassins-Creed-Trilogy', 'Call-Of-Duty', 'Grand-Theft-Auto', 'Fantasy', 'World-War-Trilogy', 'Survival', 'Modern-Combat', 'Assassins-Creed-Aftermath', 'Comical', 'Medieval', 'Secret-Service', 'Medal-of-Honor', 'Futuristic', 'Super-Natural', 'Horror', 'Others'];

        for (var i = 0; i < fileNames.length; i++) {
            var fileName = fileNames[i];
            var className = classNames[i];
            (function (className) {
                $.get('game-list/' + fileName, function (data) {
                    var lines = data.split('\n');
                    var listItems = '';
                    for (var j = 0; j < lines.length; j++) {
                        listItems += '<li class="list-group-item list-group-item-action list-group-item-warning">' + lines[j] + '</li>';
                    }
                    $('.' + className).append('<ul class="list-group">' + '<h3 class="list-group-item list-group-item-action list-group-item-danger">' + className + '</h3>' + listItems + '</ul>');
                });
            })(className);
        }
    });
</script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha2/dist/js/bootstrap.bundle.min.js" integrity="sha384-qKXV1j0HvMUeCBQ+QVp7JcfGl760yU08IQ+GpUo5hlbpg51QRiuqHAJz8+BrxE/N" crossorigin="anonymous"></script>
</body>
</html>
