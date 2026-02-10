const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

// ミドルウェア設定
app.use(cors()); // CORS有効化(フロントエンドからのアクセスを許可)
app.use(express.json()); // JSONボディをパース
app.use(express.static('public')); // 静的ファイル配信

// ========================
// API エンドポイント
// ========================

// 1. シンプルなテストAPI
app.get('/api/test', (req, res) => {
    res.json({
        status: 'success',
        message: 'APIが正常に動作しています!',
        timestamp: new Date().toISOString()
    });
});

// 2. チェックボックスの値を受け取るAPI
app.post('/api/checkbox', (req, res) => {
    const { checkedItems } = req.body;
    
    console.log('受信したチェックボックス:', checkedItems);
    
    // チェックされた項目数に応じて異なるメッセージを返す
    let message = '';
    const count = checkedItems.length;
    
    if (count === 0) {
        message = '何も選択されていません';
    } else if (count === 1) {
        message = `${checkedItems[0]}が選択されました`;
    } else if (count === 2) {
        message = `${checkedItems.join('と')}が選択されました`;
    } else {
        message = `全部選択されました: ${checkedItems.join(', ')}`;
    }
    
    res.json({
        status: 'success',
        count: count,
        items: checkedItems,
        message: message
    });
});

// 3. ラジオボタンの値を受け取るAPI
app.post('/api/radio', (req, res) => {
    const { selectedValue } = req.body;
    
    console.log('受信したラジオボタン:', selectedValue);
    
    // 選択された値に応じて異なるレスポンスを返す
    const responses = {
        'rdobtn01': {
            message: '選択肢1が選ばれました!',
            color: '#ff6b6b',
            emoji: '🎉'
        },
        'rdobtn02': {
            message: '選択肢2が選ばれました!',
            color: '#4ecdc4',
            emoji: '✨'
        },
        'rdobtn03': {
            message: '選択肢3が選ばれました!',
            color: '#ffe66d',
            emoji: '🌟'
        }
    };
    
    const response = responses[selectedValue] || {
        message: '不明な選択です',
        color: '#999',
        emoji: '❓'
    };
    
    res.json({
        status: 'success',
        selected: selectedValue,
        ...response
    });
});
// 4. セレクトボックスの値を受け取るAPI
app.post('/api/selectbox', (req, res) => {
    const { selectedItem } = req.body;
    
    console.log('受信したセレクトボックス:', selectedItem);
    
    // データが送られてこなかった場合のエラーハンドリング
    if (!selectedItem) {
        return res.status(400).json({
            status: 'error',
            message: '選択項目が送信されていません'
        });
    }
    
    // 選択された値に応じたメッセージを作成
    let message = `${selectedItem}が選択されました`;
    
    res.json({
        status: 'success',
        selectedValue: selectedItem,  // 単一の値
        message: message
    });
});

// 5. ユーザー情報を取得するAPI(モックデータ)
app.get('/api/user/:id', (req, res) => {
    const userId = req.params.id;
    
    // モックユーザーデータ
    const users = {
        '1': { name: '山田太郎', role: 'Developer', level: 'Beginner' },
        '2': { name: '佐藤花子', role: 'Designer', level: 'Intermediate' },
        '3': { name: '鈴木一郎', role: 'Manager', level: 'Expert' }
    };
    
    const user = users[userId];
    
    if (user) {
        res.json({
            status: 'success',
            data: user
        });
    } else {
        res.status(404).json({
            status: 'error',
            message: 'ユーザーが見つかりません'
        });
    }
});

// 6. フォームデータを保存するAPI(メモリ上に保存)
let formSubmissions = [];

app.post('/api/form/submit', (req, res) => {
    const formData = req.body;
    
    // タイムスタンプを付与
    const submission = {
        id: formSubmissions.length + 1,
        ...formData,
        submittedAt: new Date().toISOString()
    };
    
    formSubmissions.push(submission);
    
    console.log('フォーム送信:', submission);
    
    res.json({
        status: 'success',
        message: 'データを保存しました',
        data: submission
    });
});

// 7. 保存されたフォームデータを取得
app.get('/api/form/submissions', (req, res) => {
    res.json({
        status: 'success',
        count: formSubmissions.length,
        data: formSubmissions
    });
});

// エラーハンドリング
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        status: 'error',
        message: 'サーバーエラーが発生しました'
    });
});

// サーバー起動
app.listen(PORT, () => {
    console.log(`🚀 サーバーが起動しました: http://localhost:${PORT}`);
    console.log(`📝 API エンドポイント:`);
    console.log(`   GET  /api/test`);
    console.log(`   POST /api/checkbox`);
    console.log(`   POST /api/checkbox_`);
    console.log(`   POST /api/radio`);
    console.log(`   POST /api/selectbox`);
    console.log(`   GET  /api/user/:id`);
    console.log(`   POST /api/form/submit`);
    console.log(`   GET  /api/form/submissions`);
});