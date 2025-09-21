# 硬件设备API接口文档

## 概述

本API为AI废物管理系统的硬件MVP提供RESTful接口，支持设备注册、事件上报、状态监控等功能。

## 基础信息

- **Base URL**: `https://your-domain.com/api/hardware`
- **Content-Type**: `application/json`
- **认证**: 通过 `x-device-id` 请求头标识设备

## API端点

### 1. 事件管理

#### 上报废物倾倒事件
\`\`\`http
POST /api/hardware/events
\`\`\`

**请求体**:
\`\`\`json
{
  "location_id": "KS001",
  "event_type": "illegal_dumping",
  "coordinates": {
    "lat": 31.3889,
    "lng": 120.9789
  },
  "confidence_score": 0.85,
  "image_url": "https://example.com/image.jpg",
  "video_url": "https://example.com/video.mp4",
  "metadata": {
    "camera_angle": "front",
    "weather": "sunny"
  }
}
\`\`\`

**响应**:
\`\`\`json
{
  "success": true,
  "event_id": "uuid",
  "message": "事件上报成功",
  "data": { ... }
}
\`\`\`

#### 查询事件列表
\`\`\`http
GET /api/hardware/events?location_id=KS001&status=pending&limit=50&offset=0
\`\`\`

#### 获取事件详情
\`\`\`http
GET /api/hardware/events/{event_id}
\`\`\`

#### 更新事件状态
\`\`\`http
PUT /api/hardware/events/{event_id}
\`\`\`

### 2. 监控点管理

#### 注册监控点
\`\`\`http
POST /api/hardware/locations
\`\`\`

**请求体**:
\`\`\`json
{
  "id": "KS001",
  "name": "昆山玉山镇监控点1",
  "address": "江苏省昆山市玉山镇人民路123号",
  "coordinates": {
    "lat": 31.3889,
    "lng": 120.9789
  },
  "camera_status": "active",
  "settings": {
    "detection_sensitivity": 0.8,
    "recording_enabled": true
  }
}
\`\`\`

#### 获取监控点列表
\`\`\`http
GET /api/hardware/locations?active_only=true
\`\`\`

#### 设备心跳检测
\`\`\`http
POST /api/hardware/locations/{location_id}/ping
\`\`\`

**请求体**:
\`\`\`json
{
  "camera_status": "active",
  "settings": {
    "detection_sensitivity": 0.8
  },
  "metadata": {
    "cpu_usage": 45,
    "memory_usage": 60,
    "disk_space": 80
  }
}
\`\`\`

### 3. 警报管理

#### 获取警报列表
\`\`\`http
GET /api/hardware/alerts?location_id=KS001&status=active&limit=20
\`\`\`

#### 确认警报
\`\`\`http
PUT /api/hardware/alerts/{alert_id}/acknowledge
\`\`\`

## 事件类型

- `illegal_dumping`: 非法倾倒
- `overflowing_bin`: 垃圾桶溢出
- `suspicious_activity`: 可疑活动
- `maintenance_needed`: 需要维护

## 状态码

- `pending`: 待处理
- `processing`: 处理中
- `resolved`: 已解决
- `dismissed`: 已忽略

## 错误处理

所有错误响应格式:
\`\`\`json
{
  "error": "错误描述",
  "code": "ERROR_CODE"
}
\`\`\`

常见HTTP状态码:
- `200`: 成功
- `400`: 请求参数错误
- `404`: 资源不存在
- `409`: 资源冲突
- `500`: 服务器内部错误

## 使用示例

### Python示例
\`\`\`python
import requests

# 设备注册
response = requests.post(
    'https://your-domain.com/api/hardware/locations',
    headers={'x-device-id': 'device-001'},
    json={
        'id': 'KS001',
        'name': '昆山监控点1',
        'coordinates': {'lat': 31.3889, 'lng': 120.9789}
    }
)

# 上报事件
response = requests.post(
    'https://your-domain.com/api/hardware/events',
    headers={'x-device-id': 'device-001'},
    json={
        'location_id': 'KS001',
        'event_type': 'illegal_dumping',
        'coordinates': {'lat': 31.3889, 'lng': 120.9789},
        'confidence_score': 0.85
    }
)
\`\`\`

### Arduino/ESP32示例
\`\`\`cpp
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

void reportEvent() {
  HTTPClient http;
  http.begin("https://your-domain.com/api/hardware/events");
  http.addHeader("Content-Type", "application/json");
  http.addHeader("x-device-id", "esp32-001");
  
  StaticJsonDocument<200> doc;
  doc["location_id"] = "KS001";
  doc["event_type"] = "illegal_dumping";
  doc["coordinates"]["lat"] = 31.3889;
  doc["coordinates"]["lng"] = 120.9789;
  doc["confidence_score"] = 0.85;
  
  String requestBody;
  serializeJson(doc, requestBody);
  
  int httpResponseCode = http.POST(requestBody);
  String response = http.getString();
  
  http.end();
}
