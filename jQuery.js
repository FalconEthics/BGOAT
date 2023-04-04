$(document).ready(function () {
    let fileNames = ['ACT.txt', 'COD.txt', 'GTA.txt', 'fantasy.txt', 'WWT.txt', 'survival.txt', 'MC.txt', 'ACM.txt', 'comical.txt', 'medieval.txt', 'SS.txt', 'MOH.txt', 'futuristic.txt', 'SN.txt', 'horror.txt', 'others.txt'];
    let classNames = ['Assassins-Creed-Trilogy', 'Call-Of-Duty', 'Grand-Theft-Auto', 'Fantasy', 'World-War-Trilogy', 'Survival', 'Modern-Combat', 'Assassins-Creed-Aftermath', 'Comical', 'Medieval', 'Secret-Service', 'Medal-of-Honor', 'Futuristic', 'Super-Natural', 'Horror', 'Others'];

    for (let i = 0; i < fileNames.length; i++) {
        let fileName = fileNames[i];
        let className = classNames[i];
        (function (className) {
            $.get('game-list/' + fileName, function (data) {
                let lines = data.split('\n');
                let listItems = '';
                for (let j = 0; j < lines.length; j++) {
                    listItems += '<a class="list-group-item list-group-item-action list-group-item-dark"' + 'href="https://www.google.com/search?q=' + lines[j].split(' ').join('+') + '+buy">' + lines[j] + '</a>';
                }
                $('.' + className).append('<div class="list-group">' + '<h3 class="list-group-item list-group-item-action list-group-item-success">' + className + '</h3>' + listItems + '</div>');
            });
        })(className);
    }
    $(document).ready(function () {
        var audioElement = new Audio('./bensound-moose.mp3');
        var isInputClicked = false;
        var isH3Present = false;

        $('input').on('click', function () {
            isInputClicked = true;
            audioElement.play();
        });

        setInterval(function() {
            if ($('h3').length && !isInputClicked) {
                isH3Present = true;
                audioElement.play();
            } else if (!$('h3').length && isH3Present) {
                isH3Present = false;
                audioElement.pause();
            }
        }, 1000);

        audioElement.addEventListener('ended', function () {
            this.currentTime = 0;
            this.play();
        }, false);

        audioElement.play();
    });
});