let seconds = 0; // 計時器秒數
let timerInterval; // 計時器的間隔ID
let reminders = []; // 儲存未觸發提醒的陣列
let completedReminders = []; // 儲存已觸發提醒的陣列

// 啟動計時器
function startTimer() {
    // 偵測是否已經啟動計時器，若已啟動則不重複啟動
    if (timerInterval) {
        return;
    }

    // 跳出通知訊息
    Swal.fire({
        title: '開始計時!',
        icon: 'success',
        timer: 2000,
        timerProgressBar: true
    });
    
    timerInterval = setInterval(function () {
        seconds++;
        updateTimerDisplay();
        checkReminders(); // 檢查並觸發提醒
    }, 1000);
}

// 暫停計時器
function pauseTimer() {
    // 跳出通知訊息
    Swal.fire({
        title: '你已暫停!',
        timer: 2000,
        timerProgressBar: true
    });
    clearInterval(timerInterval);
    timerInterval = null; // 重置 timerInterval 變數
}

// 重置計時器
function resetTimer() {
    seconds = 0;
    updateTimerDisplay();
    clearInterval(timerInterval);
    timerInterval = null; // Reset timerInterval to null
    reminders = reminders.concat(completedReminders); // 將已完成的提醒重新加入待提醒清單
    completedReminders = []; // 清空已完成提醒清單
    updateReminderList();
    updateCompletedReminderList();
}

// 更新計時器顯示
function updateTimerDisplay() {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const formattedTime = padZero(minutes) + ":" + padZero(remainingSeconds);
    document.getElementById("timer").innerText = formattedTime;
}

// 數字補零函數
function padZero(number) {
    return number < 10 ? "0" + number : number;
}

// 新增提醒
function addReminder() {
    const reminderInput = document.getElementById("reminderInput");
    const reminderTime = parseInt(reminderInput.value, 10);

    if (!isNaN(reminderTime) && reminderTime > 0) {
        reminders.push(reminderTime * 60); // 轉換成秒並加入提醒清單
        reminderInput.value = ''; // 清空輸入框
        updateReminderList();
    }
}

// 檢查並觸發提醒
function checkReminders() {
    for (let i = 0; i < reminders.length; i++) {
        if (seconds === reminders[i]) {
            showAlert();
            completedReminders.push(reminders[i]); // 將觸發的提醒移動到已完成清單
            reminders.splice(i, 1); // 從提醒清單中移除
            updateReminderList();
            updateCompletedReminderList(); // 更新已完成提醒的UI
        }
    }
}

// 顯示提醒彈窗
function showAlert() {
    Swal.fire({
        title: '時間到!',
        text: '提醒訊息',
        icon: 'success',
        timer: 5000,
        timerProgressBar: true
    });
}

// 更新提醒清單UI
function updateReminderList() {
    const reminderList = document.getElementById("reminderList");
    reminderList.innerHTML = '<strong>提醒清單：</strong>';

    if (reminders.length === 0) {
        reminderList.innerHTML += '<div class="reminder-item">無</div>';
    } else {
        reminders.forEach(function (reminder, index) {
            const listItem = document.createElement('div');
            listItem.className = 'reminder-item';
            listItem.innerHTML = Math.floor(reminder / 60) + '分';
            reminderList.appendChild(listItem);
        });
    }
}

// 更新已完成提醒清單UI
function updateCompletedReminderList() {
    const completedList = document.getElementById("completedReminderList");
    completedList.innerHTML = '<strong>已完成提醒：</strong>';

    if (completedReminders.length === 0) {
        completedList.innerHTML += '<div class="reminder-item">無</div>';
    } else {
        completedReminders.forEach(function (reminder) {
            const listItem = document.createElement('div');
            listItem.className = 'reminder-item completed';
            listItem.innerHTML = Math.floor(reminder / 60) + '分';
            completedList.appendChild(listItem);
        });
    }
}

// 清除提醒
function clearReminders() {
    // 跳出通知訊息
    Swal.fire({
        title: '已清除所有提醒!',
        icon: 'success',
        timer: 2000,
        timerProgressBar: true
    });
    reminders = [];
    completedReminders = [];
    updateReminderList();
    updateCompletedReminderList();
}

// 當按下放大按鈕，就將其切換成縮小按鈕，反覆切換顯示大小
function changeZoombtn(io) {
    // io = 1 放大
    // io = 0 縮小
    var x = document.getElementById("zoombtn");
    if (io == 1) {
        document.getElementById('timer').style.fontSize='10em'; // 更新font-size
        x.innerHTML = '<i class="material-icons left">zoom_out</i>縮小碼表';
        document.getElementById('timer').className='center-align'; // 更新class center-align
        x.onclick = function () { changeZoombtn(0); };
    } else {
        document.getElementById('timer').style.fontSize='4em'; // 更新font-size
        x.innerHTML = '<i class="material-icons left">zoom_in</i>放大碼表';
        document.getElementById('timer').className='timer'; // 更新class
        x.onclick = function () { changeZoombtn(1); };
    }
}

// 當按下暗色模式按鈕，就將其切換成亮色模式按鈕，並改變背景顏色
function changeDarkmodebtn(io) {
    // io = 1 暗色模式
    // io = 0 亮色模式
    var x = document.getElementById("darkbtn");
    if (io == 1) {
        document.body.style.backgroundColor='#212121';
        document.getElementById('darkmodebtn').innerHTML='<i class="material-icons left">brightness_4</i>亮色模式';
        document.getElementById('darkmodebtn').onclick=function () { changeDarkmodebtn(0); };
        // 更新原本文字的顏色
        document.getElementById('timer').style.color='#ffffff';
        document.getElementById('reminderList').style.color='#ffffff';
        document.getElementById('completedReminderList').style.color='#ffffff';
        // 輸入框文字的顯示顏色
        document.getElementById('reminderInput').style.color='#ffffff';
    } else {
        document.body.style.backgroundColor='#ffffff';
        document.getElementById('darkmodebtn').innerHTML='<i class="material-icons left">brightness_4</i>暗色模式';
        document.getElementById('darkmodebtn').onclick=function () { changeDarkmodebtn(1); };
        // 更新原本文字的顏色
        document.getElementById('timer').style.color='#212121';
        document.getElementById('reminderList').style.color='#212121';
        document.getElementById('completedReminderList').style.color='#212121';
        // 輸入框文字的顯示顏色
        document.getElementById('reminderInput').style.color='#212121';
    }
}

