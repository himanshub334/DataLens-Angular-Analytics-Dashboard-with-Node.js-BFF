INSERT INTO customers(customer_name,segment,created_at) VALUES
('Aarav Mehta','Enterprise','2025-02-10'),
('Isha Shah','SMB','2025-03-15'),
('Rohan Patil','Consumer','2025-04-20'),
('Neha Kulkarni','Enterprise','2025-06-02'),
('Kabir Joshi','SMB','2025-08-11')
ON CONFLICT DO NOTHING;

INSERT INTO transactions(transaction_date,customer_id,channel,category,amount,status)
SELECT DATE '2026-01-01',id,'WEB','Software',1200,'COMPLETED' FROM customers WHERE customer_name='Aarav Mehta'
UNION ALL SELECT DATE '2026-01-02',id,'MOBILE','Services',850,'COMPLETED' FROM customers WHERE customer_name='Isha Shah'
UNION ALL SELECT DATE '2026-01-03',id,'WEB','Software',1600,'COMPLETED' FROM customers WHERE customer_name='Rohan Patil'
UNION ALL SELECT DATE '2026-01-04',id,'PARTNER','Services',2300,'COMPLETED' FROM customers WHERE customer_name='Neha Kulkarni'
UNION ALL SELECT DATE '2026-01-05',id,'WEB','Hardware',900,'COMPLETED' FROM customers WHERE customer_name='Kabir Joshi'
UNION ALL SELECT DATE '2026-01-06',id,'MOBILE','Software',1400,'COMPLETED' FROM customers WHERE customer_name='Aarav Mehta'
UNION ALL SELECT DATE '2026-01-07',id,'WEB','Services',1100,'COMPLETED' FROM customers WHERE customer_name='Isha Shah'
UNION ALL SELECT DATE '2026-01-08',id,'PARTNER','Software',3100,'COMPLETED' FROM customers WHERE customer_name='Neha Kulkarni'
UNION ALL SELECT DATE '2026-01-09',id,'WEB','Hardware',700,'COMPLETED' FROM customers WHERE customer_name='Rohan Patil'
UNION ALL SELECT DATE '2026-01-10',id,'MOBILE','Services',1800,'COMPLETED' FROM customers WHERE customer_name='Kabir Joshi';
