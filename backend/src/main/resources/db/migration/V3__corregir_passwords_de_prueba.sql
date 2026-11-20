UPDATE usuarios
SET password = CASE
    WHEN id_usuario = 1 AND email = 'admin@nextvoto.com' THEN '$2a$10$QDdUAz4dHkSubnO9/8WaK.soxeRgiMkJvozkQY63rGS4QHHaaES.y'
    WHEN id_usuario = 2 AND email = 'carlos.mendoza@nextvoto.com' THEN '$2a$10$Xe6QVFkFolB7I33Zjc0ZReH8xnVmWZTNJMrODO4v.x2kkrcLFezB.'
    WHEN id_usuario = 3 AND email = 'laura.gomez@nextvoto.com' THEN '$2a$10$BqEdZkiV9ZgoEu7tLedaeOOqHE0lf14jw3/wAG/yh/fPuiyKMYr2e'
    WHEN id_usuario = 4 AND email = 'roberto.diaz@nextvoto.com' THEN '$2a$10$zBICuEyE7adt1OVx9SXEeuFVk196lHlPfPClvYYWzYgmGXeOrpk7K'
    WHEN id_usuario = 5 AND email = 'miguel@nextvoto.com' THEN '$2a$10$HiyoEgGX/aNrwi.gNcmtD.6AbU9nSrKv/CYe.eV7N.qiA9Gbw5.p.'
    WHEN id_usuario = 6 AND email = 'ana.torres@nextvoto.com' THEN '$2a$10$5EyO6QkvCWUXX22pgG7vAO.BnJygIzOq.kTg16/cf8rZoYgWNzj8S'
    WHEN id_usuario = 7 AND email = 'luis.ruiz@nextvoto.com' THEN '$2a$10$KYlH3ffW6f.g/booEwzb/uPMB/.wolsU4zntkYRBezfTNglo4SyQq'
    WHEN id_usuario = 8 AND email = 'valeria.castro@nextvoto.com' THEN '$2a$10$86y1LZyoi7veLMFVEVdGeOBAPhxGE1t6.wExUIwrwDbbt0Lzn4lym'
    WHEN id_usuario = 9 AND email = 'diego.morales@nextvoto.com' THEN '$2a$10$0eLLU.I0nTP3.LgRqa2Y6.C.qhezos5eoEICWzcTzQWEJW3a5.j9q'
    WHEN id_usuario = 10 AND email = 'fernanda.silva@nextvoto.com' THEN '$2a$10$4HAEq3T.Vr9Uz6oUwMZfouU5M7eUXbFIRO7hkdq7Vdi1xtr.CWu72'
    WHEN id_usuario = 11 AND email = 'jorge.herrera@nextvoto.com' THEN '$2a$10$6Dg9LBvXG4QbiwRT3UXeveeYaSrpbC5rPzanUzNCV2QCPehX/Vg7C'
    WHEN id_usuario = 12 AND email = 'camila.vargas@nextvoto.com' THEN '$2a$10$XnVyUYsgh8NgI8aslZy.gO8Pem7s7a6Fhu.v1N77B0niXTa4JAdly'
    WHEN id_usuario = 13 AND email = 'andres.navarro@nextvoto.com' THEN '$2a$10$x/OdDG4FF2Y0XgQkwEHXcuW4.GSnvQIVCB0W.czVkYfZFVABXJwXq'
    WHEN id_usuario = 14 AND email = 'mariana.delgado@nextvoto.com' THEN '$2a$10$qV.Zjlxg5BlwOTdKaIZcL.uBQ8iWqocliwbFKY7QkFjZr//nAcEG2'
    WHEN id_usuario = 15 AND email = 'inactivo@nextvoto.com' THEN '$2a$10$7LHhsmDl1fa6ihbpnrq5h.Ah4CRYcGCwAlUjQltWLnaGYk0DJuHNK'
    ELSE password
END
WHERE password = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy' AND id_usuario BETWEEN 1 AND 15;
