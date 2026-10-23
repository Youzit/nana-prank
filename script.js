document.addEventListener('DOMContentLoaded', () => {
    // --- Element References ---
    const loadingScreen = document.getElementById('loading-screen');
    const loadingBar = document.getElementById('loading-bar');
    const loadingText = document.getElementById('loading-text');
    
    const runawayButtonScreen = document.getElementById('runaway-button-screen');
    const runawayBtn = document.getElementById('runaway-btn');

    const tosModal = document.getElementById('tos-modal');
    const tosContent = document.getElementById('tos-content');
    const acceptTosBtn = document.getElementById('accept-tos-btn');

    const finaleScreen = document.getElementById('finale-screen');
    const restartBtn = document.getElementById('restart-btn');
    
    let runawayAttempts = 0;
    let popupsClosedCount = 0;
    const POPUP_CLOSE_LIMIT = 10; // End prank after this many popups are closed

    let availablePopups = [];
    let confettiInterval;

    // --- Prank Logic ---

    // Prank 1: Fake Loading (Now with Reverse!)
    function startLoadingPrank() {
        let width = 0;
        let loadingForward = true;

        const interval = setInterval(() => {
            if (loadingForward) {
                width++;
                loadingBar.style.width = width + '%';
                if (width > 30 && width < 60) loadingText.textContent = '正在校准banana能量……';
                if (width > 60) loadingText.textContent = '马上就好啦……真的！';

                if (width >= 100) {
                    loadingForward = false;
                    loadingText.textContent = '等等，好像哪里不对……撤回进度！';
                    loadingText.classList.add('text-yellow-400');
                }
            } else { // Reversing
                width--;
                loadingBar.style.width = width + '%';
                if (width > 50) loadingText.textContent = '正在反向校准……';
                if (width < 50) loadingText.textContent = '这不科学！进度条怎么倒着走！';

                if (width <= 0) {
                    clearInterval(interval);
                    loadingText.textContent = '骗你的啦！娜娜，真正的考验现在开始～';
                    loadingText.classList.remove('text-yellow-400');
                    loadingText.classList.add('text-green-400');
                    setTimeout(() => {
                        loadingScreen.classList.add('hidden');
                        runawayButtonScreen.classList.remove('hidden');
                        positionRunawayButton();
                    }, 2000);
                }
            }
        }, 40);
    }

    // Prank 2: The Runaway Button (with taunts)
    const runawayMessages = [
        '差一点点！', '就差一点！', '再试试嘛！', '抓不到我～',
        '娜娜，手速呢？', '快一点快一点！', '欸？又没点到！', 'banana 溜啦！'
    ];
    
    function positionRunawayButton() {
        const x = Math.random() * (window.innerWidth - runawayBtn.offsetWidth - 40) + 20;
        const y = Math.random() * (window.innerHeight - runawayBtn.offsetHeight - 40) + 20;
        runawayBtn.style.left = `${x}px`;
        runawayBtn.style.top = `${y}px`;
    }

    function handleRunaway() {
        runawayAttempts++;
        if (runawayAttempts > 8) {
            runawayButtonScreen.classList.add('hidden');
            startTosPrank();
        } else {
            runawayBtn.textContent = runawayMessages[runawayAttempts % runawayMessages.length];
            positionRunawayButton();
        }
    }

    runawayBtn.addEventListener('mouseover', handleRunaway);
    runawayBtn.addEventListener('click', (e) => {
        e.preventDefault();
        handleRunaway();
    });


    // Prank 3: Fake Terms of Service
    function startTosPrank() {
        const gibberish = `《娜娜的banana宇宙用户协议》

第一条：使用者同意接受banana研究所的随机抽查，详情请看第五条。
第二条：当页面突然出现奇怪内容时，请保持冷静，并假装一切尽在掌握。
第三条：系统有权在任何时刻询问“今天吃banana了吗？”
第四条：王双娜（昵称：娜娜，代号：banana）被授予“banana宇宙特别观察员”称号，但不享有跳过本协议的权利。
第五条：详情请看第六条。
第六条：详情请看第七条。
第七条：如发现本协议越读越长，请不要怀疑人生，这就是协议的特色。
第八条：看30s广告解锁哦~
第九条：没有第九条

本协议最终解释权不归任何人所有😁。

`.repeat(4);
        tosContent.textContent = gibberish;
        tosModal.classList.remove('hidden');

        tosContent.addEventListener('scroll', () => {
            if (tosContent.scrollTop + tosContent.clientHeight >= tosContent.scrollHeight - 10) {
                acceptTosBtn.disabled = false;
                acceptTosBtn.classList.remove('opacity-50', 'cursor-not-allowed');
                acceptTosBtn.classList.add('hover:bg-green-700');
            }
        });
    }

    acceptTosBtn.addEventListener('click', () => {
        if (!acceptTosBtn.disabled) {
            tosModal.classList.add('hidden');
            startPopupPrank();
        }
    });

    // Prank 4 & 5: Hydra Pop-ups with Confetti Finale
    const popupsData = [
        { title: "banana补给站", message: "恭喜获得无限量banana补给！本奖励仅限想象，点击关闭即可继续做梦。", color: 'bg-blue-500' },
        { title: "系统警报", message: "检测到设备的迷惑指数过高！建议立即补充一点理智。", color: 'bg-red-500' },
        { title: "新关注提醒", message: "太在意别人就会成为别人的内裤！", color: 'bg-purple-500' },
        { title: "饼干使用说明", message: "本页面原本准备使用 Cookie，但饼干已经被吃光了。", color: 'bg-yellow-600' },
        { title: "温馨提示", message: "永远记住遇到困难的时候你的背后还有你的屁股", color: 'bg-green-500' },
        { title: "免费旅行大奖", message: "恭喜获得荒岛一日游！往返交通、住宿和求生技能均需自备。", color: 'bg-teal-500' },
        { title: "身份验证", message: "请证明你不是banana机器人：请在心里默念三遍“我真的不是香蕉”。", color: 'bg-gray-600' },
        { title: "前方出现拦路选手！", message: "它挡住了你的去路，也挡住了你的屏幕。请尝试用意念绕行。", color: 'bg-indigo-500' },
        { title: "这不是弹窗", message: "尼要的全纳走", color: 'bg-pink-500' },
        { title: "纳尼", message: "人生有时就像中年发福拉不上的裤链一样棘手", color: 'bg-orange-500' }
    ];

    function resetAvailablePopups() {
        availablePopups = [...popupsData];
    }

    function getUniquePopupData() {
        if (availablePopups.length === 0) {
            resetAvailablePopups(); // Refill if we run out
        }
        const index = Math.floor(Math.random() * availablePopups.length);
        const data = availablePopups[index];
        availablePopups.splice(index, 1); // Remove from pool to ensure uniqueness
        return data;
    }

    function triggerConfetti() {
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }

        // Clear any existing interval
        if (confettiInterval) {
            clearInterval(confettiInterval);
        }

        confettiInterval = setInterval(function() {
            const particleCount = 50;
            // since particles fall down, start a bit higher than random
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
        }, 250);
    }

    function createPopup() {
        const data = getUniquePopupData();
        const popup = document.createElement('div');
        popup.className = `popup fixed w-72 p-4 rounded-lg shadow-2xl text-white ${data.color}`;
        popup.style.left = `${Math.random() * (window.innerWidth - 300)}px`;
        popup.style.top = `${Math.random() * (window.innerHeight - 200)}px`;
        
        popup.innerHTML = `
            <h3 class="font-bold text-lg">${data.title}</h3>
            <p class="text-sm mt-2">${data.message}</p>
            <button class="absolute top-2 right-2 text-white font-bold pointer-events-none">&times;</button>
        `;
        
        document.body.appendChild(popup);

        popup.addEventListener('click', () => {
            popup.remove();
            popupsClosedCount++;

            if (popupsClosedCount >= POPUP_CLOSE_LIMIT) {
                // End the prank
                document.querySelectorAll('.popup').forEach(p => p.remove());
                finaleScreen.classList.remove('hidden');
                finaleScreen.classList.add('flex');
                triggerConfetti();
            } else {
                // Spawn TEN more
                for (let i = 0; i < 10; i++) {
                    createPopup();
                }
            }
        });
    }

    function startPopupPrank() {
        resetAvailablePopups();
        // Start with 3 initial popups to get things going
        for (let i = 0; i < 3; i++) {
                setTimeout(() => {
                createPopup();
                }, i * 200);
        }
    }

    // Finale: Restart button
    restartBtn.addEventListener('click', () => {
        if (confettiInterval) {
            clearInterval(confettiInterval);
        }
        if (typeof confetti !== 'undefined') {
            confetti.reset();
        }
        finaleScreen.classList.add('hidden');
        finaleScreen.classList.remove('flex');
        loadingScreen.classList.remove('hidden');
        loadingBar.style.width = '0%';
        loadingText.textContent = '正在加载迷惑能量……';
        loadingText.classList.remove('text-red-500', 'text-yellow-400', 'text-green-400');
        runawayAttempts = 0;
        popupsClosedCount = 0;
        runawayBtn.textContent = '点击继续（如果你抓得到）';
        document.querySelectorAll('.popup').forEach(p => p.remove());
        startLoadingPrank();
    });

    // --- Initial Start ---
    startLoadingPrank();
});