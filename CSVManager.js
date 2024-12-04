// CSVファイルを読み込む関数
async function loadCSVData(url) {
  const response = await fetch(url);
  const text = await response.text();
  const rows = text.split('\n').slice(1); // ヘッダーを除去

  const data = [];
  rows.forEach(row => {
    const cols = row.split(',');
    if (cols.length >= 3) {
      data.push({
        x: parseFloat(cols[0]),
        y: parseFloat(cols[1]),
        z: parseFloat(cols[2])
      });
    }
  });
  return data;
}

// データを0〜1の範囲に正規化する関数
function normalizeData(data) {
  const minMax = calculateMinMax(data);

  // 正規化
  return data.map(point => ({
    x: (point.x - minMax.min.x) / (minMax.max.x - minMax.min.x),
    y: (point.y - minMax.min.y) / (minMax.max.y - minMax.min.y),
    z: (point.z - minMax.min.z) / (minMax.max.z - minMax.min.z)
  }));
}

// データの最小値と最大値を計算する関数
function calculateMinMax(data) {
  let min = { x: Infinity, y: Infinity, z: Infinity };
  let max = { x: -Infinity, y: -Infinity, z: -Infinity };

  data.forEach(point => {
    min.x = Math.min(min.x, point.x);
    min.y = Math.min(min.y, point.y);
    min.z = Math.min(min.z, point.z);

    max.x = Math.max(max.x, point.x);
    max.y = Math.max(max.y, point.y);
    max.z = Math.max(max.z, point.z);
  });

  return { min, max };
}

export { loadCSVData, normalizeData, calculateMinMax };
