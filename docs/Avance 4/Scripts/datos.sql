-- CLIENTES
INSERT INTO clientes (rfc, curp, nombre_completo, fecha_nacimiento, nacionalidad, pais_nacimiento, genero, estado_civil, tel_celular, correo)
VALUES
('GOCJ800101AAA','GOCJ800101HDFXXX01','Juan Manuel González de Cossío','1980-01-01','Mexicana','México','Masculino','Soltero','4421234567','juan1@gmail.com'),
('RODM850202BBB','RODM850202MDFXXX02','María Rodríguez López','1985-02-02','Mexicana','México','Femenino','Casada','4421234568','maria@gmail.com'),
('PEHJ900303CCC','PEHJ900303HDFXXX03','Juan Pérez Hernández','1990-03-03','Mexicana','México','Masculino','Soltero','4421234569','juanp@gmail.com'),
('LOAG880404DDD','LOAG880404MDFXXX04','Ana López García','1988-04-04','Mexicana','México','Femenino','Soltera','4421234570','ana@gmail.com'),
('MECR920505EEE','MECR920505HDFXXX05','Carlos Méndez Ruiz','1992-05-05','Mexicana','México','Masculino','Casado','4421234571','carlos@gmail.com'),
('SAGL870606FFF','SAGL870606MDFXXX06','Laura Sánchez Gómez','1987-06-06','Mexicana','México','Femenino','Soltera','4421234572','laura@gmail.com'),
('TORJ910707GGG','TORJ910707HDFXXX07','Jorge Torres Díaz','1991-07-07','Mexicana','México','Masculino','Casado','4421234573','jorge@gmail.com'),
('HERC930808HHH','HERC930808MDFXXX08','Carla Hernández Soto','1993-08-08','Mexicana','México','Femenino','Soltera','4421234574','carla@gmail.com'),
('VAGP860909III','VAGP860909HDFXXX09','Pedro Vargas León','1986-09-09','Mexicana','México','Masculino','Casado','4421234575','pedro@gmail.com'),
('RUFM940101JJJ','RUFM940101MDFXXX10','Fernanda Ruiz Morales','1994-01-01','Mexicana','México','Femenino','Soltera','4421234576','fer@gmail.com'),
('MOLR950202KKK','MOLR950202HDFXXX11','Luis Molina Reyes','1995-02-02','Mexicana','México','Masculino','Soltero','4421234577','luis@gmail.com'),
('CAST960303LLL','CAST960303MDFXXX12','Sofía Castro Núñez','1996-03-03','Mexicana','México','Femenino','Soltera','4421234578','sofia@gmail.com'),
('RIVJ970404MMM','RIVJ970404HDFXXX13','José Rivera Campos','1997-04-04','Mexicana','México','Masculino','Soltero','4421234579','jose@gmail.com'),
('ALBG980505NNN','ALBG980505MDFXXX14','Gabriela Álvarez Flores','1998-05-05','Mexicana','México','Femenino','Soltera','4421234580','gaby@gmail.com'),
('DELR990606OOO','DELR990606HDFXXX15','Ricardo Delgado Ruiz','1999-06-06','Mexicana','México','Masculino','Soltero','4421234581','ricardo@gmail.com'),
('PERE000707PPP','PERE000707MDFXXX16','Elena Pérez Salas','2000-07-07','Mexicana','México','Femenino','Soltera','4421234582','elena@gmail.com'),
('LOZS010808QQQ','LOZS010808HDFXXX17','Sergio Lozano Cruz','2001-08-08','Mexicana','México','Masculino','Soltero','4421234583','sergio@gmail.com'),
('NAVM020909RRR','NAVM020909MDFXXX18','Mariana Navarro Díaz','2002-09-09','Mexicana','México','Femenino','Soltera','4421234584','mariana@gmail.com'),
('ORTA030101SSS','ORTA030101HDFXXX19','Antonio Ortega Ruiz','2003-01-01','Mexicana','México','Masculino','Soltero','4421234585','antonio@gmail.com'),
('SILF040202TTT','SILF040202MDFXXX20','Fernanda Silva Gómez','2004-02-02','Mexicana','México','Femenino','Soltera','4421234586','fernanda@gmail.com');

-- PRODUCTOS
INSERT INTO productos (nombre_producto, clasificacion_riesgo)
VALUES
('Cuenta Ahorro','Bajo'),
('Cuenta Corriente','Medio'),
('Tarjeta Crédito','Alto'),
('Crédito Personal','Alto'),
('Hipoteca','Medio'),
('Inversión','Alto'),
('Seguro','Bajo'),
('Transferencias','Medio'),
('Divisas','Alto'),
('Fondos','Medio');

-- CONTRATOS
INSERT INTO contratos (cliente_id, producto_id, fecha_apertura, estatus)
VALUES
(1,1,'2023-01-01','Activo'),
(2,2,'2023-01-02','Activo'),
(3,3,'2023-01-03','Activo'),
(4,4,'2023-01-04','Activo'),
(5,5,'2023-01-05','Activo'),
(6,6,'2023-01-06','Activo'),
(7,7,'2023-01-07','Activo'),
(8,8,'2023-01-08','Activo'),
(9,9,'2023-01-09','Activo'),
(10,10,'2023-01-10','Activo'),
(11,1,'2023-01-11','Activo'),
(12,2,'2023-01-12','Activo'),
(13,3,'2023-01-13','Activo'),
(14,4,'2023-01-14','Activo'),
(15,5,'2023-01-15','Activo'),
(16,6,'2023-01-16','Activo'),
(17,7,'2023-01-17','Activo'),
(18,8,'2023-01-18','Activo'),
(19,9,'2023-01-19','Activo'),
(20,10,'2023-01-20','Activo');

-- OPERACIONES
INSERT INTO operaciones (contrato_id, monto, tipo_movimiento)
VALUES
(1,5000,'Depósito'),(1,2000,'Retiro'),
(2,8000,'Depósito'),(2,1500,'Retiro'),
(3,12000,'Transferencia'),(3,3000,'Retiro'),
(4,7000,'Depósito'),(4,2500,'Retiro'),
(5,9000,'Transferencia'),(5,2000,'Depósito'),
(6,11000,'Retiro'),(6,4000,'Depósito'),
(7,6000,'Transferencia'),(7,2000,'Retiro'),
(8,3000,'Depósito'),(8,1000,'Retiro'),
(9,15000,'Transferencia'),(9,5000,'Retiro'),
(10,20000,'Depósito'),(10,7000,'Retiro'),
(11,4000,'Depósito'),(11,1500,'Retiro'),
(12,8500,'Transferencia'),(12,2500,'Retiro'),
(13,13000,'Depósito'),(13,6000,'Transferencia'),
(14,9500,'Retiro'),(14,3500,'Depósito'),
(15,10000,'Transferencia'),(15,2000,'Retiro'),
(16,7000,'Depósito'),(16,3000,'Retiro'),
(17,6000,'Transferencia'),(17,1500,'Depósito'),
(18,5000,'Retiro'),(18,2000,'Depósito'),
(19,11000,'Transferencia'),(19,4000,'Retiro'),
(20,9000,'Depósito'),(20,3000,'Retiro'),
(1,6000,'Transferencia'),(2,4500,'Depósito'),
(3,7000,'Retiro'),(4,8000,'Transferencia'),
(5,5500,'Depósito'),(6,3000,'Retiro'),
(7,9000,'Transferencia'),(8,2000,'Depósito'),
(9,12000,'Retiro'),(10,15000,'Transferencia');