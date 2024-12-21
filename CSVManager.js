// CSVファイルを読み込む関数
async function loadCSVData(url) {
  const response = await fetch(url);
  const text = await response.text();
  const rows = text.split('\n').slice(1); // ヘッダーを除去

  const data = [];
  rows.forEach(row => {
    const cols = row.split(',');
    if (cols.length >= 3) { // 最低3つの変数を想定
      const point = {
        x: parseFloat(cols[0]),
        y: parseFloat(cols[1]),
        z: parseFloat(cols[2])
      };
      if (cols.length >= 4) { // 第4の変数があれば追加
        point.size = parseFloat(cols[3]);
      }
      if (cols.length >= 5) { // 第5の変数があればカラーコードとして追加
        const colorCode = cols[4].trim();
        point.color = /^0x[0-9A-Fa-f]{6}$/i.test(colorCode) ? parseInt(colorCode, 16) : 0xffff00; // 0x形式の検証と変換
      } else {
        point.color = 0xffff00; // デフォルトカラー
      }
      data.push(point);
    }
  });
  return data;
}

// データを0〜1の範囲に正規化する関数
function normalizeData(data) {
  const minMax = calculateMinMax(data);

  // 正規化とサイズ倍率調整
  return data.map(point => ({
    x: (point.x - minMax.min.x) / (minMax.max.x - minMax.min.x),
    y: (point.y - minMax.min.y) / (minMax.max.y - minMax.min.y),
    z: (point.z - minMax.min.z) / (minMax.max.z - minMax.min.z),
    size: point.size !== undefined
      ? (point.size - minMax.min.size) / (minMax.max.size - minMax.min.size)
      : undefined, // sizeが存在しない場合はundefined
    color: point.color // カラーコードはそのまま維持
  }));
}

// データの最小値と最大値を計算する関数
function calculateMinMax(data) {
  let min = { x: Infinity, y: Infinity, z: Infinity, size: Infinity };
  let max = { x: -Infinity, y: -Infinity, z: -Infinity, size: -Infinity };

  data.forEach(point => {
    min.x = Math.min(min.x, point.x);
    min.y = Math.min(min.y, point.y);
    min.z = Math.min(min.z, point.z);
    if (point.size !== undefined) {
      min.size = Math.min(min.size, point.size);
      max.size = Math.max(max.size, point.size);
    }

    max.x = Math.max(max.x, point.x);
    max.y = Math.max(max.y, point.y);
    max.z = Math.max(max.z, point.z);
  });

  return { min, max };
}

export { loadCSVData, normalizeData, calculateMinMax };
