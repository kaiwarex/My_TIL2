// APIのベースURL
const API_BASE_URL = 'http://localhost:3000/api';  // ← ここを修正!

// ========================
// ユーティリティ関数
// ========================

/**
 * APIを叩く共通関数
 */
async function callAPI(endpoint, method = 'GET', data = null) {
    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        }
    };
    
    if (data && method !== 'GET') {
        options.body = JSON.stringify(data);
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('API呼び出しエラー:', error);
        return {
            status: 'error',
            message: 'APIとの通信に失敗しました'
        };
    }
}

/**
 * 結果を画面に表示する関数
 */
function displayResult(message, type = 'info') {
    const dispField = document.getElementById('disp_field');
    dispField.textContent = message;
    
    // タイプに応じて色を変える
    const colors = {
        'success': '#4CAF50',
        'error': '#f44336',
        'info': '#2196F3',
        'warning': '#ff9800'
    };
    
    dispField.style.color = colors[type] || colors.info;
    dispField.style.fontWeight = 'bold';
    dispField.style.marginTop = '10px';
    dispField.style.display = 'block';
}

// ========================
// 既存の関数(API連携版)
// ========================

/**
 * test01: シンプルなAPIテスト
 */
async function test01() {
    console.log("test01()");
    displayResult('APIを呼び出し中...', 'info');
    
    const result = await callAPI('/test');
    
    if (result.status === 'success') {
        displayResult(`✅ ${result.message}`, 'success');
        console.log('APIレスポンス:', result);
    } else {
        displayResult(`❌ ${result.message}`, 'error');
    }
}

/**
 * test02: チェックボックスの値をAPIに送信
 */
async function test02() {
    // チェックボックスの要素を取得
    const checkboxes = [
        document.getElementById('chk01'),
        document.getElementById('chk02'),
        document.getElementById('chk03')
    ];
    
    // チェックされている項目を収集
    const checkedItems = checkboxes
        .filter(cb => cb.checked)
        .map(cb => cb.value);
    
    console.log('チェックされた項目:', checkedItems);
    
    // APIに送信
    displayResult('APIにデータを送信中...', 'info');
    
    const result = await callAPI('/checkbox', 'POST', { 
        checkedItems: checkedItems 
    });
    
    if (result.status === 'success') {
        displayResult(`✅ ${result.message} (${result.count}個選択)`, 'success');
        console.log('サーバーレスポンス:', result);
    } else {
        displayResult(`❌ ${result.message}`, 'error');
    }
}

async function test02_a(){
    const checkboxes_ = document.getElementById('chk');
    const checkedItems_ = checkboxes_.checked;

    // APIに送信
    displayResult('APIにデータを送信中...', 'info');
    
    const result = await callAPI('/checkbox_', 'POST', { 
        checkedItems_: checkedItems_ 
    });
    if (result.status === 'success') {
        displayResult(`✅ ${result.message} (${result.count}個選択)`, 'success');
        console.log('サーバーレスポンス:', result);
    } else {
        displayResult(`❌ ${result.message}`, 'error');
    }
}

/**
 * test03: ラジオボタンの値をAPIに送信
 */
async function test03() {
    // ラジオボタンの要素を取得
    const radioButtons = [
        document.getElementById('rdo01'),
        document.getElementById('rdo02'),
        document.getElementById('rdo03')
    ];
    
    // 選択されているラジオボタンを探す
    const selectedRadio = radioButtons.find(rb => rb.checked);
    
    if (!selectedRadio) {
        displayResult('⚠️ ラジオボタンが選択されていません', 'warning');
        return;
    }
    
    console.log('選択されたラジオボタン:', selectedRadio.value);
    
    // APIに送信
    displayResult('APIにデータを送信中...', 'info');
    
    const result = await callAPI('/radio', 'POST', {
        selectedValue: selectedRadio.value
    });
    
    if (result.status === 'success') {
        displayResult(`${result.emoji} ${result.message}`, 'success');
        console.log('サーバーレスポンス:', result);
        
        // おまけ: 背景色を変える
        const dispField = document.getElementById('disp_field');
        dispField.style.backgroundColor = result.color;
        dispField.style.padding = '10px';
        dispField.style.borderRadius = '5px';
    } else {
        displayResult(`❌ ${result.message}`, 'error');
    }
}

/**
 * test04: セレクトボックスの値をAPIに送信
 */
async function test04() {
    // セレクトボックスの要素を取得
    const selectBox = document.getElementById('pet-select');
    
    if (!selectBox) {
        displayResult('⚠️ セレクトボックスが見つかりません', 'warning');
        return;
    }
    
    const selectedItem = selectBox.value;  // 選択された値を取得
    
    if (!selectedItem) {
        displayResult('⚠️ 何も選択されていません', 'warning');
        return;
    }
    
    console.log('選択された項目:', selectedItem);
    
    // APIに送信
    displayResult('APIにデータを送信中...', 'info');
    
    const result = await callAPI('/selectbox', 'POST', {
        selectedItem: selectedItem
    });
    
    if (result.status === 'success') {
        displayResult(`✅ ${result.message}`, 'success');
        console.log('サーバーレスポンス:', result);
    } else {
        displayResult(`❌ ${result.message}`, 'error');
    }
}


// ========================
// 追加の便利関数
// ========================

/**
 * ユーザー情報を取得する例
 */
async function fetchUserInfo(userId) {
    displayResult(`ユーザー${userId}の情報を取得中...`, 'info');
    
    const result = await callAPI(`/user/${userId}`);
    
    if (result.status === 'success') {
        const user = result.data;
        const message = `👤 ${user.name} (${user.role}) - レベル: ${user.level}`;
        displayResult(message, 'success');
        console.log('ユーザー情報:', user);
    } else {
        displayResult(`❌ ${result.message}`, 'error');
    }
}

/**
 * フォームデータを送信する例
 */
async function submitForm() {
    const formData = {
        name: '山田太郎',
        email: 'yamada@example.com',
        message: 'テストメッセージです'
    };
    
    displayResult('フォームを送信中...', 'info');
    
    const result = await callAPI('/form/submit', 'POST', formData);
    
    if (result.status === 'success') {
        displayResult(`✅ ${result.message} (ID: ${result.data.id})`, 'success');
        console.log('送信結果:', result.data);
    } else {
        displayResult(`❌ ${result.message}`, 'error');
    }
}

/**
 * 保存されたフォームデータを取得する例
 */
async function getSubmissions() {
    displayResult('データを取得中...', 'info');
    
    const result = await callAPI('/form/submissions');
    
    if (result.status === 'success') {
        displayResult(`✅ ${result.count}件のデータが見つかりました`, 'success');
        console.log('保存されたデータ:', result.data);
        console.table(result.data); // テーブル形式で表示
    } else {
        displayResult(`❌ ${result.message}`, 'error');
    }
}

// ========================
// ページ読み込み時の初期化
// ========================
document.addEventListener('DOMContentLoaded', () => {
    console.log('📱 フロントエンド準備完了');
    console.log('🔌 API接続先:', API_BASE_URL);
    
    // APIが生きているかチェック(オプション)
    checkAPIHealth();
});

/**
 * API疎通確認
 */
async function checkAPIHealth() {
    try {
        const result = await callAPI('/test');
        if (result.status === 'success') {
            console.log('✅ APIサーバーと接続できました');
        } else {
            console.warn('⚠️ APIサーバーが応答しましたが、エラーが発生しています');
        }
    } catch (error) {
        console.error('❌ APIサーバーに接続できません。サーバーが起動していることを確認してください。');
    }
}