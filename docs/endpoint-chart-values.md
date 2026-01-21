# Endpoint: /api/analytics/chart-values

Mục đích: cung cấp dữ liệu thời gian (time series) để hiển thị biểu đồ trong UI.

**Đường dẫn**: `/api/analytics/chart-values`

**Method**: `GET`

**Auth**: Bearer token (Authorization: `Bearer <token>`) — nếu hệ thống yêu cầu.

**Query Parameters**

- `metric` (string, required): tên số liệu (ví dụ `visits`, `conversion_rate`, `revenue`).
- `start` (ISO8601 datetime, optional): thời điểm bắt đầu (ví dụ `2026-01-01T00:00:00Z`).
- `end` (ISO8601 datetime, optional): thời điểm kết thúc.
- `interval` (string, optional): khoảng thời gian tập hợp (`minute|hour|day|week`). Mặc định `hour`.
- `storeId` (string, optional): lọc theo cửa hàng hoặc nguồn dữ liệu.
- `limit` (integer, optional): số điểm trả về tối đa.
- `aggregate` (string, optional): phương thức tổng hợp (`sum|avg|min|max`).


**Request example (cURL)**

```bash
curl -H "Authorization: Bearer $TOKEN" \
  "https://api.example.com/api/analytics/chart-values?metric=visits&start=2026-01-01T00:00:00Z&end=2026-01-07T23:59:59Z&interval=day"
```


**Success response (200)**

Content-Type: `application/json`

Body schema:

```json
{
  "meta": {
    "metric": "visits",
    "start": "2026-01-01T00:00:00Z",
    "end": "2026-01-07T23:59:59Z",
    "interval": "day",
    "points": 7
  },
  "series": [
    { "timestamp": "2026-01-01T00:00:00Z", "value": 120 },
    { "timestamp": "2026-01-02T00:00:00Z", "value": 135 },
    { "timestamp": "2026-01-03T00:00:00Z", "value": 98 }
  ]
}
```

Gợi ý cho UI/charting libraries:
- `series` là mảng điểm theo thứ tự tăng dần của `timestamp`.
- `timestamp` dùng ISO string hoặc Unix ms (thống nhất với frontend).
- Nếu UI muốn mảng tuple: có thể hỗ trợ thêm `seriesTuples: [[unixMs, value], ...]`.


**Error responses**

- `400 Bad Request` — thiếu `metric` hoặc param sai định dạng.
- `401 Unauthorized` — thiếu/không hợp lệ token.
- `500 Internal Server Error` — lỗi server/tính toán.

Ví dụ lỗi 400:

```json
{ "error": "invalid_param", "message": "start must be ISO8601" }
```


**TypeScript interfaces (ví dụ)**

```ts
interface ChartPoint {
  timestamp: string; // ISO8601
  value: number;
}

interface ChartResponse {
  meta: {
    metric: string;
    start?: string;
    end?: string;
    interval: string;
    points: number;
  };
  series: ChartPoint[];
}
```


**Performance & caching**
- Khuyến nghị cache trả về theo query key (`metric|start|end|interval|storeId`) ở layer CDN hoặc server-side cache.
- Hạn chế `limit` mặc định để tránh trả quá nhiều điểm (ví dụ cap ở 10k).


**Notes**
- Nếu dữ liệu thô lớn, server nên trả dữ liệu đã aggregate (theo `interval`) để giảm payload.
- Thống nhất timezone giữa backend và frontend (ưu tiên UTC).


---

Tùy chỉnh thêm: nếu bạn muốn, tôi sẽ thêm ví dụ gọi bằng `fetch`/`axios` và ví dụ chuyển `series` sang format phù hợp cho `nivo` hoặc `chart.js`.
