# Skybound Sprint

2Dアスレチックアクションゲーム。iPhoneのPWA、タッチ操作、キーボード、Xboxコントローラーに対応します。

## 今回のゲームプレイ全面改修

- 全5ステージをテーマ別に再構成
  - Green Run
  - Broken Valley
  - Wall Ruins
  - Velocity Factory
  - Sky Tower
- ハート3制 / GAME OVER / チェックポイント復帰
- コヨーテタイム
- ジャンプ入力バッファ
- 可変ジャンプ
- 壁キック入力猶予
- 左右入力2連打ダッシュ
- ダッシュ残像 / パーティクル / カメラシェイク
- 動く足場
- 崩れる足場
- バウンド敵
- スターコイン各ステージ3個
- S / A / B / Cタイムランク
- ベストタイム保存
- ステージ解放状況保存
- スターコイン記録保存
- 自己ベストのゴースト表示
- ステージセレクト
- ポーズメニュー
- 最終ステージは縦スクロールのSky Tower

## 操作

### キーボード
- 移動: ← → / A D
- ジャンプ: Space / W / ↑
- ダッシュ: 同じ方向を素早く2回
- 壁キック: 壁際でジャンプ
- ポーズ: ESC

### iPhone / スマホ
- 左右ボタン
- JUMP
- 同じ方向ボタンを素早く2回でダッシュ
- マルチタッチ対応

### Xboxコントローラー
- 左スティック / D-pad: 移動
- A: ジャンプ
- 同じ方向を2回入力: ダッシュ
- START: ポーズ

## 操作感の補助

プレイヤーに厳密なフレーム入力を要求しすぎないため、足場から落ちた直後でもジャンプできるコヨーテタイム、着地直前のジャンプ入力を保持するジャンプバッファ、壁から少し離れた後でも成立する壁キック猶予を実装しています。

## 保存

localStorageに以下を保存します。
- ステージ解放
- ベストタイム
- スターコイン数
- ゴーストデータ
- ゴースト表示設定

## PWA

GitHub PagesのURLをiPhone Safariで開き、「ホーム画面に追加」するとstandalone Webアプリとして起動できます。Service Workerは `skybound-v5` です。

## 素材

- Graphics: Kenney / CC0
- Sound Effects: Kenney / CC0
- Music: Two Simple Game Music Loops by qubodup / CC0

詳細は `CREDITS.txt`、`REMOTE_ASSETS.md`、`AUDIO_REAL_ASSETS.md` を参照してください。
