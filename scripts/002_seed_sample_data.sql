-- Insert sample monitoring locations
INSERT INTO monitoring_locations (id, name, address, coordinates, camera_status, settings) VALUES
('loc_001', '社区垃圾站A', '北京市朝阳区建国路88号', '{"lat": 39.9042, "lng": 116.4074}', 'active', '{"ai_sensitivity": 0.8, "voice_enabled": true}'),
('loc_002', '社区垃圾站B', '北京市海淀区中关村大街1号', '{"lat": 39.9889, "lng": 116.3058}', 'active', '{"ai_sensitivity": 0.7, "voice_enabled": true}'),
('loc_003', '社区垃圾站C', '上海市浦东新区陆家嘴环路1000号', '{"lat": 31.2304, "lng": 121.4737}', 'active', '{"ai_sensitivity": 0.9, "voice_enabled": false}'),
('loc_004', '社区垃圾站D', '深圳市南山区科技园南区', '{"lat": 22.5431, "lng": 113.9339}', 'maintenance', '{"ai_sensitivity": 0.8, "voice_enabled": true}');

-- Insert sample waste events
INSERT INTO waste_events (location_id, location_name, event_type, confidence_score, detected_at, status, coordinates, metadata) VALUES
('loc_001', '社区垃圾站A', 'illegal_dumping', 0.92, NOW() - INTERVAL '2 hours', 'active', '{"lat": 39.9042, "lng": 116.4074}', '{"detected_objects": ["plastic_bags", "cardboard"], "person_count": 1}'),
('loc_002', '社区垃圾站B', 'normal_disposal', 0.85, NOW() - INTERVAL '4 hours', 'resolved', '{"lat": 39.9889, "lng": 116.3058}', '{"detected_objects": ["household_waste"], "person_count": 1}'),
('loc_001', '社区垃圾站A', 'bin_full', 0.95, NOW() - INTERVAL '6 hours', 'investigating', '{"lat": 39.9042, "lng": 116.4074}', '{"fill_level": 0.95}'),
('loc_003', '社区垃圾站C', 'illegal_dumping', 0.88, NOW() - INTERVAL '8 hours', 'resolved', '{"lat": 31.2304, "lng": 121.4737}', '{"detected_objects": ["furniture", "electronics"], "person_count": 2}'),
('loc_002', '社区垃圾站B', 'illegal_dumping', 0.91, NOW() - INTERVAL '12 hours', 'active', '{"lat": 39.9889, "lng": 116.3058}', '{"detected_objects": ["construction_waste"], "person_count": 1}'),
('loc_004', '社区垃圾站D', 'maintenance', 0.99, NOW() - INTERVAL '1 day', 'active', '{"lat": 22.5431, "lng": 113.9339}', '{"issue": "camera_offline"}');

-- Insert sample alerts
INSERT INTO alerts (event_id, alert_type, message, sent_at, status) 
SELECT 
  id,
  'voice_warning',
  '请注意：检测到非法倾倒行为，请立即停止并正确分类投放垃圾。',
  detected_at + INTERVAL '5 seconds',
  'sent'
FROM waste_events 
WHERE event_type = 'illegal_dumping' AND status = 'active';
