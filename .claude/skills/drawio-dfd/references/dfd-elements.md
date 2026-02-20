# DFD要素 XMLリファレンス

## 目次
1. [プロセス（Process）](#プロセスprocess)
2. [データストア（Data Store）](#データストアdata-store)
3. [外部エンティティ（External Entity）](#外部エンティティexternal-entity)
4. [データフロー（Data Flow）](#データフローdata-flow)

---

## プロセス（Process）

円形または丸角長方形。データの変換・処理を表す。

### 円形プロセス
```xml
<mxCell id="{id}" value="{ラベル}" style="ellipse;whiteSpace=wrap;html=1;fillColor=#dae8fc;strokeColor=#6c8ebf;" vertex="1" parent="1">
  <mxGeometry x="{x}" y="{y}" width="80" height="80" as="geometry"/>
</mxCell>
```

### 丸角長方形プロセス（Gane-Sarson記法）
```xml
<mxCell id="{id}" value="{ラベル}" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#dae8fc;strokeColor=#6c8ebf;" vertex="1" parent="1">
  <mxGeometry x="{x}" y="{y}" width="120" height="60" as="geometry"/>
</mxCell>
```

### 番号付きプロセス
```xml
<mxCell id="{id}" value="&lt;b&gt;{番号}&lt;/b&gt;&lt;hr&gt;{プロセス名}" style="ellipse;whiteSpace=wrap;html=1;fillColor=#dae8fc;strokeColor=#6c8ebf;" vertex="1" parent="1">
  <mxGeometry x="{x}" y="{y}" width="100" height="100" as="geometry"/>
</mxCell>
```

---

## データストア（Data Store）

開いた長方形または平行線。データの保存場所を表す。

### 標準データストア（開いた長方形）
```xml
<mxCell id="{id}" value="{ストア名}" style="shape=partialRectangle;whiteSpace=wrap;html=1;left=1;right=1;fillColor=#fff2cc;strokeColor=#d6b656;" vertex="1" parent="1">
  <mxGeometry x="{x}" y="{y}" width="120" height="40" as="geometry"/>
</mxCell>
```

### 番号付きデータストア
```xml
<mxCell id="{id}" value="D{番号} | {ストア名}" style="shape=partialRectangle;whiteSpace=wrap;html=1;left=1;right=1;fillColor=#fff2cc;strokeColor=#d6b656;" vertex="1" parent="1">
  <mxGeometry x="{x}" y="{y}" width="140" height="40" as="geometry"/>
</mxCell>
```

### 二重線データストア（代替スタイル）
```xml
<mxCell id="{id}" value="{ストア名}" style="shape=parallelogram;perimeter=parallelogramPerimeter;whiteSpace=wrap;html=1;fixedSize=1;fillColor=#fff2cc;strokeColor=#d6b656;direction=south;" vertex="1" parent="1">
  <mxGeometry x="{x}" y="{y}" width="120" height="40" as="geometry"/>
</mxCell>
```

---

## 外部エンティティ（External Entity）

四角形。システム外部のアクター（人、組織、システム）を表す。

### 標準外部エンティティ
```xml
<mxCell id="{id}" value="{エンティティ名}" style="rounded=0;whiteSpace=wrap;html=1;fillColor=#f5f5f5;strokeColor=#666666;fontColor=#333333;" vertex="1" parent="1">
  <mxGeometry x="{x}" y="{y}" width="100" height="60" as="geometry"/>
</mxCell>
```

### 影付き外部エンティティ
```xml
<mxCell id="{id}" value="{エンティティ名}" style="rounded=0;whiteSpace=wrap;html=1;fillColor=#f5f5f5;strokeColor=#666666;fontColor=#333333;shadow=1;" vertex="1" parent="1">
  <mxGeometry x="{x}" y="{y}" width="100" height="60" as="geometry"/>
</mxCell>
```

### 二重線外部エンティティ（重複を示す）
```xml
<mxCell id="{id}" value="{エンティティ名}" style="rounded=0;whiteSpace=wrap;html=1;fillColor=#f5f5f5;strokeColor=#666666;fontColor=#333333;double=1;" vertex="1" parent="1">
  <mxGeometry x="{x}" y="{y}" width="100" height="60" as="geometry"/>
</mxCell>
```

---

## データフロー（Data Flow）

矢印。データの流れを表す。

### 標準データフロー（直線矢印）
```xml
<mxCell id="{id}" value="{フロー名}" style="edgeStyle=none;html=1;endArrow=classic;endFill=1;" edge="1" parent="1" source="{source_id}" target="{target_id}">
  <mxGeometry relative="1" as="geometry"/>
</mxCell>
```

### 曲線データフロー
```xml
<mxCell id="{id}" value="{フロー名}" style="edgeStyle=orthogonalEdgeStyle;rounded=1;html=1;endArrow=classic;endFill=1;" edge="1" parent="1" source="{source_id}" target="{target_id}">
  <mxGeometry relative="1" as="geometry"/>
</mxCell>
```

### 双方向データフロー
```xml
<mxCell id="{id}" value="{フロー名}" style="edgeStyle=none;html=1;endArrow=classic;endFill=1;startArrow=classic;startFill=1;" edge="1" parent="1" source="{source_id}" target="{target_id}">
  <mxGeometry relative="1" as="geometry"/>
</mxCell>
```

### ラベル位置調整付きデータフロー
```xml
<mxCell id="{id}" value="{フロー名}" style="edgeStyle=orthogonalEdgeStyle;html=1;endArrow=classic;endFill=1;" edge="1" parent="1" source="{source_id}" target="{target_id}">
  <mxGeometry x="0.3" y="10" relative="1" as="geometry">
    <mxPoint as="offset"/>
  </mxGeometry>
</mxCell>
```

---

## 色の推奨パターン

| 要素 | fillColor | strokeColor | 意味 |
|------|-----------|-------------|------|
| プロセス | #dae8fc | #6c8ebf | 青系（処理） |
| データストア | #fff2cc | #d6b656 | 黄系（保存） |
| 外部エンティティ | #f5f5f5 | #666666 | グレー系（外部） |
| データフロー | - | #000000 | 黒（標準） |

## ID命名規則

一貫性のため以下の命名規則を推奨：
- プロセス: `process_{番号}` (例: `process_1`, `process_2`)
- データストア: `datastore_{番号}` (例: `datastore_1`)
- 外部エンティティ: `entity_{名前}` (例: `entity_customer`)
- データフロー: `flow_{source}_{target}` (例: `flow_process_1_datastore_1`)
