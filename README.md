# Skybound Sprint

2Dアスレチックアクションゲーム。iPhoneのPWA、タッチ操作、キーボード、Xboxコントローラーに対応します。

## Full Power Expansion

全12ステージ構成に拡張しました。

1. Green Run
2. Broken Valley
3. Wall Ruins
4. Velocity Factory
5. Sky Tower
6. Storm Railway
7. Crystal Cavern
8. Windy Peaks
9. Flooded Temple
10. Gravity Lab
11. Sunset Escape
12. Final Ascent

後半は単純な難易度上昇ではなく、強制スクロール、暗闇、風、水位変化、重力変化、追跡、複合ギミックなど、ステージごとに遊び方が変わります。

## コアゲームプレイ

- ハート3制 / GAME OVER / チェックポイント復帰
- コヨーテタイム
- ジャンプ入力バッファ
- 可変ジャンプ
- 壁キック入力猶予
- 左右入力2連打ダッシュ
- ダッシュ残像 / パーティクル / カメラシェイク
- 動く足場 / 崩れる足場
- Walker / Bounce / Charger / Flyer / Turret 敵
- スターコイン各ステージ3個
- S / A / B / Cタイムランク
- ベストタイム / ステージ解放 / スター / ゴースト保存
- ステージセレクト
- ポーズ

## パフォーマンス改善

iPhone Safariでのカクつきを抑えるため、以下を実施しています。

- 接地中の着地SE・パーティクル多重発生を修正
- HUDのDOM更新を約10Hzに制限し、内容変化時のみ書き換え
- solids配列を毎回filterせずフレーム単位でキャッシュ
- パーティクル更新をin-place化して毎フレームの配列生成を削減
- SEをAudio clone連打ではなく小さなAudioプールで再利用
- 一時パーティクル / 弾数に上限
- 120Hz端末でも描画負荷が暴れないようCanvas描画を実質60fps上限に制御
- delta time上限を維持

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

## PWA

GitHub PagesのURLをiPhone Safariで開き、「ホーム画面に追加」するとstandalone Webアプリとして起動できます。Service Workerは `skybound-v8` です。

## 音楽・効果音

BGMと一部SEに魔王魂（森田交一）の公式配布音源を使用しています。

- 8bit02「こうだいなせかい」
- 8bit03「くじけぬもの」
- 8bit07「けっせん」
- 8bit21「あれるふなたび」
- システム26
- 戦闘05

音源ファイルそのものはGitHubリポジトリへ再配布せず、公式配布URLをランタイム参照します。

Graphics: Kenney / CC0
Additional legacy SFX: Kenney / CC0

詳細は `CREDITS.txt` を参照してください。
