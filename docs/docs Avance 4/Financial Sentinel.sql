--
-- PostgreSQL database dump
--

\restrict Xgkz7uJ0TmjkU2eu3PDhZ6pAHgkh7IBbdUW9TiruUK3ZrPcoZmo70IsRUcuH4EI

-- Dumped from database version 17.6
-- Dumped by pg_dump version 18.3

-- Started on 2026-04-24 19:42:25

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 32 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA public;


--
-- TOC entry 3894 (class 0 OID 0)
-- Dependencies: 32
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON SCHEMA public IS 'standard public schema';


--
-- TOC entry 443 (class 1255 OID 17744)
-- Name: fn_audit_update_perfiles(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.fn_audit_update_perfiles() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Registramos cambios en el monto máximo permitido o en el nivel de riesgo
    IF OLD.monto_max_operacion <> NEW.monto_max_operacion OR OLD.nivel_riesgo_calculado <> NEW.nivel_riesgo_calculado THEN
        INSERT INTO BITACORAS_AUDITORIA (
            usuario_id, 
            accion, 
            tabla_afectada, 
            valor_anterior, 
            valor_nuevo
        ) VALUES (
            1, -- ID del usuario que hizo el cambio
            'UPDATE_PERFIL_RIESGO', 
            'PERFILES_TRANSACCIONALES', 
            'Monto Max: ' || OLD.monto_max_operacion || ' | Riesgo: ' || OLD.nivel_riesgo_calculado,
            'Monto Max: ' || NEW.monto_max_operacion || ' | Riesgo: ' || NEW.nivel_riesgo_calculado
        );
    END IF;
    RETURN NEW;
END;
$$;


--
-- TOC entry 442 (class 1255 OID 17742)
-- Name: fn_audit_update_reglas(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.fn_audit_update_reglas() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Solo registramos si el monto del umbral realmente cambió
    IF OLD.umbral_global_monto <> NEW.umbral_global_monto THEN
        INSERT INTO BITACORAS_AUDITORIA (
            usuario_id, 
            accion, 
            tabla_afectada, 
            valor_anterior, 
            valor_nuevo
        ) VALUES (
            1, -- Nota: Aquí tu backend deberá pasar el ID del usuario real
            'UPDATE_UMBRAL_GLOBAL', 
            'REGLAS_MONITOREO', 
            'Regla: ' || OLD.nombre_regla || ' | Monto: ' || OLD.umbral_global_monto,
            'Monto Nuevo: ' || NEW.umbral_global_monto
        );
    END IF;
    RETURN NEW;
END;
$$;


--
-- TOC entry 441 (class 1255 OID 17739)
-- Name: fn_respaldo_cliente(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.fn_respaldo_cliente() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    INSERT INTO CLIENTES_ELIMINADOS (cliente_original_id, rfc, nombre_completo, motivo_baja)
    VALUES (OLD.id, OLD.rfc, OLD.nombre_completo, 'Baja ejecutada por el sistema');
    RETURN OLD;
END;
$$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 323 (class 1259 OID 17695)
-- Name: alertas; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.alertas (
    id integer NOT NULL,
    cliente_id integer NOT NULL,
    operacion_id integer,
    regla_id integer NOT NULL,
    estatus character varying(50) DEFAULT 'Nueva'::character varying,
    fecha_generacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- TOC entry 322 (class 1259 OID 17694)
-- Name: alertas_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.alertas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3895 (class 0 OID 0)
-- Dependencies: 322
-- Name: alertas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.alertas_id_seq OWNED BY public.alertas.id;


--
-- TOC entry 309 (class 1259 OID 17598)
-- Name: bitacoras_auditoria; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.bitacoras_auditoria (
    id integer NOT NULL,
    usuario_id integer NOT NULL,
    accion character varying(50) NOT NULL,
    tabla_afectada character varying(50) NOT NULL,
    valor_anterior text,
    valor_nuevo text,
    fecha_hora timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- TOC entry 308 (class 1259 OID 17597)
-- Name: bitacoras_auditoria_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.bitacoras_auditoria_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3896 (class 0 OID 0)
-- Dependencies: 308
-- Name: bitacoras_auditoria_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.bitacoras_auditoria_id_seq OWNED BY public.bitacoras_auditoria.id;


--
-- TOC entry 307 (class 1259 OID 17583)
-- Name: clientes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.clientes (
    id integer NOT NULL,
    rfc character varying(13) NOT NULL,
    curp character varying(18) NOT NULL,
    nombre_completo character varying(150) NOT NULL,
    fecha_nacimiento date NOT NULL,
    nacionalidad character varying(50) NOT NULL,
    pais_nacimiento character varying(50) NOT NULL,
    genero character varying(20),
    estado_civil character varying(50),
    tel_celular character varying(20),
    tel_fijo character varying(20),
    correo character varying(100),
    es_pep boolean DEFAULT false,
    actua_cuenta_propia boolean DEFAULT true
);


--
-- TOC entry 311 (class 1259 OID 17613)
-- Name: clientes_eliminados; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.clientes_eliminados (
    id integer NOT NULL,
    cliente_original_id integer NOT NULL,
    rfc character varying(13) NOT NULL,
    nombre_completo character varying(150) NOT NULL,
    fecha_eliminacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    motivo_baja text
);


--
-- TOC entry 310 (class 1259 OID 17612)
-- Name: clientes_eliminados_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.clientes_eliminados_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3897 (class 0 OID 0)
-- Dependencies: 310
-- Name: clientes_eliminados_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.clientes_eliminados_id_seq OWNED BY public.clientes_eliminados.id;


--
-- TOC entry 306 (class 1259 OID 17582)
-- Name: clientes_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.clientes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3898 (class 0 OID 0)
-- Dependencies: 306
-- Name: clientes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.clientes_id_seq OWNED BY public.clientes.id;


--
-- TOC entry 319 (class 1259 OID 17664)
-- Name: contratos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.contratos (
    id integer NOT NULL,
    cliente_id integer NOT NULL,
    producto_id integer NOT NULL,
    fecha_apertura date NOT NULL,
    estatus character varying(50) DEFAULT 'Activo'::character varying
);


--
-- TOC entry 318 (class 1259 OID 17663)
-- Name: contratos_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.contratos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3899 (class 0 OID 0)
-- Dependencies: 318
-- Name: contratos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.contratos_id_seq OWNED BY public.contratos.id;


--
-- TOC entry 327 (class 1259 OID 17782)
-- Name: credenciales_clientes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.credenciales_clientes (
    id integer NOT NULL,
    cliente_id integer NOT NULL,
    correo_acceso character varying(100) NOT NULL,
    password_hash character varying(255) NOT NULL,
    activo boolean DEFAULT true,
    ultimo_acceso timestamp without time zone,
    fecha_creacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- TOC entry 326 (class 1259 OID 17781)
-- Name: credenciales_clientes_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.credenciales_clientes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3900 (class 0 OID 0)
-- Dependencies: 326
-- Name: credenciales_clientes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.credenciales_clientes_id_seq OWNED BY public.credenciales_clientes.id;


--
-- TOC entry 313 (class 1259 OID 17623)
-- Name: direcciones; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.direcciones (
    id integer NOT NULL,
    cliente_id integer NOT NULL,
    calle character varying(150) NOT NULL,
    num_ext character varying(20) NOT NULL,
    num_int character varying(20),
    colonia character varying(100) NOT NULL,
    codigo_postal character varying(10) NOT NULL,
    municipio_alcaldia character varying(100) NOT NULL,
    estado character varying(50) NOT NULL
);


--
-- TOC entry 312 (class 1259 OID 17622)
-- Name: direcciones_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.direcciones_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3901 (class 0 OID 0)
-- Dependencies: 312
-- Name: direcciones_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.direcciones_id_seq OWNED BY public.direcciones.id;


--
-- TOC entry 317 (class 1259 OID 17650)
-- Name: expedientes_documentos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.expedientes_documentos (
    id integer NOT NULL,
    cliente_id integer NOT NULL,
    tipo_documento character varying(100) NOT NULL,
    ruta_archivo character varying(255) NOT NULL,
    fecha_subida timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    validado boolean DEFAULT false
);


--
-- TOC entry 316 (class 1259 OID 17649)
-- Name: expedientes_documentos_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.expedientes_documentos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3902 (class 0 OID 0)
-- Dependencies: 316
-- Name: expedientes_documentos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.expedientes_documentos_id_seq OWNED BY public.expedientes_documentos.id;


--
-- TOC entry 305 (class 1259 OID 17574)
-- Name: listas_riesgo; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.listas_riesgo (
    id integer NOT NULL,
    nombre_razon_social character varying(200) NOT NULL,
    alias character varying(150),
    rfc character varying(13),
    tipo_lista character varying(100) NOT NULL,
    fuente_oficial character varying(100) NOT NULL,
    pais_origen character varying(50)
);


--
-- TOC entry 304 (class 1259 OID 17573)
-- Name: listas_riesgo_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.listas_riesgo_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3903 (class 0 OID 0)
-- Dependencies: 304
-- Name: listas_riesgo_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.listas_riesgo_id_seq OWNED BY public.listas_riesgo.id;


--
-- TOC entry 321 (class 1259 OID 17682)
-- Name: operaciones; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.operaciones (
    id integer NOT NULL,
    contrato_id integer NOT NULL,
    monto numeric(15,2) NOT NULL,
    tipo_movimiento character varying(20) NOT NULL,
    fecha_operacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- TOC entry 320 (class 1259 OID 17681)
-- Name: operaciones_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.operaciones_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3904 (class 0 OID 0)
-- Dependencies: 320
-- Name: operaciones_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.operaciones_id_seq OWNED BY public.operaciones.id;


--
-- TOC entry 315 (class 1259 OID 17635)
-- Name: perfiles_transaccionales; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.perfiles_transaccionales (
    id integer NOT NULL,
    cliente_id integer NOT NULL,
    ocupacion_profesion character varying(100),
    actividad_economica character varying(150),
    origen_recursos character varying(150),
    destino_recursos character varying(150),
    ingreso_mensual_promedio numeric(15,2),
    num_operaciones_mes_estimadas integer,
    monto_max_operacion numeric(15,2),
    nivel_riesgo_calculado integer DEFAULT 1 NOT NULL
);


--
-- TOC entry 314 (class 1259 OID 17634)
-- Name: perfiles_transaccionales_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.perfiles_transaccionales_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3905 (class 0 OID 0)
-- Dependencies: 314
-- Name: perfiles_transaccionales_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.perfiles_transaccionales_id_seq OWNED BY public.perfiles_transaccionales.id;


--
-- TOC entry 301 (class 1259 OID 17559)
-- Name: productos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.productos (
    id integer NOT NULL,
    nombre_producto character varying(100) NOT NULL,
    clasificacion_riesgo character varying(50) NOT NULL
);


--
-- TOC entry 300 (class 1259 OID 17558)
-- Name: productos_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.productos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3906 (class 0 OID 0)
-- Dependencies: 300
-- Name: productos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.productos_id_seq OWNED BY public.productos.id;


--
-- TOC entry 303 (class 1259 OID 17566)
-- Name: reglas_monitoreo; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.reglas_monitoreo (
    id integer NOT NULL,
    nombre_regla character varying(150) NOT NULL,
    umbral_global_monto numeric(15,2) NOT NULL,
    activa boolean DEFAULT true
);


--
-- TOC entry 302 (class 1259 OID 17565)
-- Name: reglas_monitoreo_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.reglas_monitoreo_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3907 (class 0 OID 0)
-- Dependencies: 302
-- Name: reglas_monitoreo_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.reglas_monitoreo_id_seq OWNED BY public.reglas_monitoreo.id;


--
-- TOC entry 325 (class 1259 OID 17719)
-- Name: reportes_internos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.reportes_internos (
    id integer NOT NULL,
    usuario_id integer,
    cliente_id integer NOT NULL,
    descripcion_sospecha text NOT NULL,
    estatus character varying(50) DEFAULT 'Enviado'::character varying,
    fecha_reporte timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    es_anonimo boolean DEFAULT false,
    ruta_evidencia character varying(255)
);


--
-- TOC entry 324 (class 1259 OID 17718)
-- Name: reportes_internos_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.reportes_internos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3908 (class 0 OID 0)
-- Dependencies: 324
-- Name: reportes_internos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.reportes_internos_id_seq OWNED BY public.reportes_internos.id;


--
-- TOC entry 299 (class 1259 OID 17547)
-- Name: usuarios_sistema; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.usuarios_sistema (
    id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    correo character varying(100) NOT NULL,
    password_hash character varying(255) NOT NULL,
    rol character varying(50) NOT NULL,
    activo boolean DEFAULT true
);


--
-- TOC entry 298 (class 1259 OID 17546)
-- Name: usuarios_sistema_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.usuarios_sistema_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3909 (class 0 OID 0)
-- Dependencies: 298
-- Name: usuarios_sistema_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.usuarios_sistema_id_seq OWNED BY public.usuarios_sistema.id;


--
-- TOC entry 3673 (class 2604 OID 17698)
-- Name: alertas id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.alertas ALTER COLUMN id SET DEFAULT nextval('public.alertas_id_seq'::regclass);


--
-- TOC entry 3659 (class 2604 OID 17601)
-- Name: bitacoras_auditoria id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bitacoras_auditoria ALTER COLUMN id SET DEFAULT nextval('public.bitacoras_auditoria_id_seq'::regclass);


--
-- TOC entry 3656 (class 2604 OID 17586)
-- Name: clientes id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.clientes ALTER COLUMN id SET DEFAULT nextval('public.clientes_id_seq'::regclass);


--
-- TOC entry 3661 (class 2604 OID 17616)
-- Name: clientes_eliminados id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.clientes_eliminados ALTER COLUMN id SET DEFAULT nextval('public.clientes_eliminados_id_seq'::regclass);


--
-- TOC entry 3669 (class 2604 OID 17667)
-- Name: contratos id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contratos ALTER COLUMN id SET DEFAULT nextval('public.contratos_id_seq'::regclass);


--
-- TOC entry 3680 (class 2604 OID 17785)
-- Name: credenciales_clientes id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.credenciales_clientes ALTER COLUMN id SET DEFAULT nextval('public.credenciales_clientes_id_seq'::regclass);


--
-- TOC entry 3663 (class 2604 OID 17626)
-- Name: direcciones id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.direcciones ALTER COLUMN id SET DEFAULT nextval('public.direcciones_id_seq'::regclass);


--
-- TOC entry 3666 (class 2604 OID 17653)
-- Name: expedientes_documentos id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.expedientes_documentos ALTER COLUMN id SET DEFAULT nextval('public.expedientes_documentos_id_seq'::regclass);


--
-- TOC entry 3655 (class 2604 OID 17577)
-- Name: listas_riesgo id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.listas_riesgo ALTER COLUMN id SET DEFAULT nextval('public.listas_riesgo_id_seq'::regclass);


--
-- TOC entry 3671 (class 2604 OID 17685)
-- Name: operaciones id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.operaciones ALTER COLUMN id SET DEFAULT nextval('public.operaciones_id_seq'::regclass);


--
-- TOC entry 3664 (class 2604 OID 17638)
-- Name: perfiles_transaccionales id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.perfiles_transaccionales ALTER COLUMN id SET DEFAULT nextval('public.perfiles_transaccionales_id_seq'::regclass);


--
-- TOC entry 3652 (class 2604 OID 17562)
-- Name: productos id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.productos ALTER COLUMN id SET DEFAULT nextval('public.productos_id_seq'::regclass);


--
-- TOC entry 3653 (class 2604 OID 17569)
-- Name: reglas_monitoreo id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reglas_monitoreo ALTER COLUMN id SET DEFAULT nextval('public.reglas_monitoreo_id_seq'::regclass);


--
-- TOC entry 3676 (class 2604 OID 17722)
-- Name: reportes_internos id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reportes_internos ALTER COLUMN id SET DEFAULT nextval('public.reportes_internos_id_seq'::regclass);


--
-- TOC entry 3650 (class 2604 OID 17550)
-- Name: usuarios_sistema id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuarios_sistema ALTER COLUMN id SET DEFAULT nextval('public.usuarios_sistema_id_seq'::regclass);


--
-- TOC entry 3714 (class 2606 OID 17702)
-- Name: alertas alertas_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.alertas
    ADD CONSTRAINT alertas_pkey PRIMARY KEY (id);


--
-- TOC entry 3700 (class 2606 OID 17606)
-- Name: bitacoras_auditoria bitacoras_auditoria_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bitacoras_auditoria
    ADD CONSTRAINT bitacoras_auditoria_pkey PRIMARY KEY (id);


--
-- TOC entry 3694 (class 2606 OID 17596)
-- Name: clientes clientes_curp_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.clientes
    ADD CONSTRAINT clientes_curp_key UNIQUE (curp);


--
-- TOC entry 3702 (class 2606 OID 17621)
-- Name: clientes_eliminados clientes_eliminados_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.clientes_eliminados
    ADD CONSTRAINT clientes_eliminados_pkey PRIMARY KEY (id);


--
-- TOC entry 3696 (class 2606 OID 17592)
-- Name: clientes clientes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.clientes
    ADD CONSTRAINT clientes_pkey PRIMARY KEY (id);


--
-- TOC entry 3698 (class 2606 OID 17594)
-- Name: clientes clientes_rfc_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.clientes
    ADD CONSTRAINT clientes_rfc_key UNIQUE (rfc);


--
-- TOC entry 3710 (class 2606 OID 17670)
-- Name: contratos contratos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contratos
    ADD CONSTRAINT contratos_pkey PRIMARY KEY (id);


--
-- TOC entry 3718 (class 2606 OID 17791)
-- Name: credenciales_clientes credenciales_clientes_cliente_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.credenciales_clientes
    ADD CONSTRAINT credenciales_clientes_cliente_id_key UNIQUE (cliente_id);


--
-- TOC entry 3720 (class 2606 OID 17793)
-- Name: credenciales_clientes credenciales_clientes_correo_acceso_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.credenciales_clientes
    ADD CONSTRAINT credenciales_clientes_correo_acceso_key UNIQUE (correo_acceso);


--
-- TOC entry 3722 (class 2606 OID 17789)
-- Name: credenciales_clientes credenciales_clientes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.credenciales_clientes
    ADD CONSTRAINT credenciales_clientes_pkey PRIMARY KEY (id);


--
-- TOC entry 3704 (class 2606 OID 17628)
-- Name: direcciones direcciones_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.direcciones
    ADD CONSTRAINT direcciones_pkey PRIMARY KEY (id);


--
-- TOC entry 3708 (class 2606 OID 17657)
-- Name: expedientes_documentos expedientes_documentos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.expedientes_documentos
    ADD CONSTRAINT expedientes_documentos_pkey PRIMARY KEY (id);


--
-- TOC entry 3692 (class 2606 OID 17581)
-- Name: listas_riesgo listas_riesgo_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.listas_riesgo
    ADD CONSTRAINT listas_riesgo_pkey PRIMARY KEY (id);


--
-- TOC entry 3712 (class 2606 OID 17688)
-- Name: operaciones operaciones_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.operaciones
    ADD CONSTRAINT operaciones_pkey PRIMARY KEY (id);


--
-- TOC entry 3706 (class 2606 OID 17643)
-- Name: perfiles_transaccionales perfiles_transaccionales_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.perfiles_transaccionales
    ADD CONSTRAINT perfiles_transaccionales_pkey PRIMARY KEY (id);


--
-- TOC entry 3688 (class 2606 OID 17564)
-- Name: productos productos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.productos
    ADD CONSTRAINT productos_pkey PRIMARY KEY (id);


--
-- TOC entry 3690 (class 2606 OID 17572)
-- Name: reglas_monitoreo reglas_monitoreo_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reglas_monitoreo
    ADD CONSTRAINT reglas_monitoreo_pkey PRIMARY KEY (id);


--
-- TOC entry 3716 (class 2606 OID 17728)
-- Name: reportes_internos reportes_internos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reportes_internos
    ADD CONSTRAINT reportes_internos_pkey PRIMARY KEY (id);


--
-- TOC entry 3684 (class 2606 OID 17557)
-- Name: usuarios_sistema usuarios_sistema_correo_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuarios_sistema
    ADD CONSTRAINT usuarios_sistema_correo_key UNIQUE (correo);


--
-- TOC entry 3686 (class 2606 OID 17555)
-- Name: usuarios_sistema usuarios_sistema_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuarios_sistema
    ADD CONSTRAINT usuarios_sistema_pkey PRIMARY KEY (id);


--
-- TOC entry 3723 (class 1259 OID 17799)
-- Name: idx_credenciales_correo; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_credenciales_correo ON public.credenciales_clientes USING btree (correo_acceso);


--
-- TOC entry 3739 (class 2620 OID 17745)
-- Name: perfiles_transaccionales trg_audit_update_perfiles; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_audit_update_perfiles AFTER UPDATE ON public.perfiles_transaccionales FOR EACH ROW EXECUTE FUNCTION public.fn_audit_update_perfiles();


--
-- TOC entry 3737 (class 2620 OID 17743)
-- Name: reglas_monitoreo trg_audit_update_reglas; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_audit_update_reglas AFTER UPDATE ON public.reglas_monitoreo FOR EACH ROW EXECUTE FUNCTION public.fn_audit_update_reglas();


--
-- TOC entry 3738 (class 2620 OID 17740)
-- Name: clientes trg_respaldo_cliente_eliminado; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_respaldo_cliente_eliminado BEFORE DELETE ON public.clientes FOR EACH ROW EXECUTE FUNCTION public.fn_respaldo_cliente();


--
-- TOC entry 3731 (class 2606 OID 17703)
-- Name: alertas alertas_cliente_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.alertas
    ADD CONSTRAINT alertas_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.clientes(id) ON DELETE CASCADE;


--
-- TOC entry 3732 (class 2606 OID 17708)
-- Name: alertas alertas_operacion_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.alertas
    ADD CONSTRAINT alertas_operacion_id_fkey FOREIGN KEY (operacion_id) REFERENCES public.operaciones(id) ON DELETE CASCADE;


--
-- TOC entry 3733 (class 2606 OID 17713)
-- Name: alertas alertas_regla_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.alertas
    ADD CONSTRAINT alertas_regla_id_fkey FOREIGN KEY (regla_id) REFERENCES public.reglas_monitoreo(id);


--
-- TOC entry 3724 (class 2606 OID 17607)
-- Name: bitacoras_auditoria bitacoras_auditoria_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bitacoras_auditoria
    ADD CONSTRAINT bitacoras_auditoria_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios_sistema(id);


--
-- TOC entry 3728 (class 2606 OID 17671)
-- Name: contratos contratos_cliente_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contratos
    ADD CONSTRAINT contratos_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.clientes(id) ON DELETE CASCADE;


--
-- TOC entry 3729 (class 2606 OID 17676)
-- Name: contratos contratos_producto_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contratos
    ADD CONSTRAINT contratos_producto_id_fkey FOREIGN KEY (producto_id) REFERENCES public.productos(id);


--
-- TOC entry 3736 (class 2606 OID 17794)
-- Name: credenciales_clientes credenciales_clientes_cliente_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.credenciales_clientes
    ADD CONSTRAINT credenciales_clientes_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.clientes(id) ON DELETE CASCADE;


--
-- TOC entry 3725 (class 2606 OID 17629)
-- Name: direcciones direcciones_cliente_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.direcciones
    ADD CONSTRAINT direcciones_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.clientes(id) ON DELETE CASCADE;


--
-- TOC entry 3727 (class 2606 OID 17658)
-- Name: expedientes_documentos expedientes_documentos_cliente_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.expedientes_documentos
    ADD CONSTRAINT expedientes_documentos_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.clientes(id) ON DELETE CASCADE;


--
-- TOC entry 3730 (class 2606 OID 17689)
-- Name: operaciones operaciones_contrato_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.operaciones
    ADD CONSTRAINT operaciones_contrato_id_fkey FOREIGN KEY (contrato_id) REFERENCES public.contratos(id) ON DELETE CASCADE;


--
-- TOC entry 3726 (class 2606 OID 17644)
-- Name: perfiles_transaccionales perfiles_transaccionales_cliente_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.perfiles_transaccionales
    ADD CONSTRAINT perfiles_transaccionales_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.clientes(id) ON DELETE CASCADE;


--
-- TOC entry 3734 (class 2606 OID 17734)
-- Name: reportes_internos reportes_internos_cliente_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reportes_internos
    ADD CONSTRAINT reportes_internos_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.clientes(id) ON DELETE CASCADE;


--
-- TOC entry 3735 (class 2606 OID 17729)
-- Name: reportes_internos reportes_internos_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reportes_internos
    ADD CONSTRAINT reportes_internos_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios_sistema(id);


-- Completed on 2026-04-24 19:42:39

--
-- PostgreSQL database dump complete
--

\unrestrict Xgkz7uJ0TmjkU2eu3PDhZ6pAHgkh7IBbdUW9TiruUK3ZrPcoZmo70IsRUcuH4EI

