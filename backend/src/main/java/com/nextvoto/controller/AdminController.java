package com.nextvoto.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.nextvoto.dto.admin.AdminDTO.CambioEstado;
import com.nextvoto.dto.admin.AdminDTO.CambioRol;
import com.nextvoto.dto.admin.AdminDTO.EncuestaListado;
import com.nextvoto.dto.admin.AdminDTO.NuevoUsuario;
import com.nextvoto.dto.admin.AdminDTO.Resumen;
import com.nextvoto.dto.admin.AdminDTO.UsuarioListado;
import com.nextvoto.service.AdminService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/resumen")
    public Resumen resumen() {
        return adminService.obtenerResumen();
    }

    @GetMapping("/usuarios")
    public List<UsuarioListado> usuarios() {
        return adminService.listarUsuarios();
    }

    @PostMapping("/usuarios")
    @ResponseStatus(HttpStatus.CREATED)
    public UsuarioListado crearUsuario(@Valid @RequestBody NuevoUsuario datos) {
        return adminService.crearUsuario(datos);
    }

    @PatchMapping("/usuarios/{id}/rol")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void cambiarRol(@PathVariable Long id, @Valid @RequestBody CambioRol datos, Principal admin) {
        adminService.cambiarRol(id, datos.rol(), admin.getName());
    }

    @PatchMapping("/usuarios/{id}/estado")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void cambiarEstado(@PathVariable Long id, @Valid @RequestBody CambioEstado datos, Principal admin) {
        adminService.cambiarEstado(id, datos.activo(), admin.getName());
    }

    @DeleteMapping("/usuarios/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminarUsuario(@PathVariable Long id, Principal admin) {
        adminService.eliminarUsuario(id, admin.getName());
    }

    @GetMapping("/encuestas")
    public List<EncuestaListado> encuestas() {
        return adminService.listarEncuestas();
    }

    @PatchMapping("/encuestas/{id}/cerrar")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void cerrarEncuesta(@PathVariable Long id) {
        adminService.cerrarEncuesta(id);
    }

    @DeleteMapping("/encuestas/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminarEncuesta(@PathVariable Long id) {
        adminService.eliminarEncuesta(id);
    }
}
