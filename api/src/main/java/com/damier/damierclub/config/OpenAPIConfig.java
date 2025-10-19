package com.damier.damierclub.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.tags.Tag;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;

@Configuration
public class OpenAPIConfig {

    @Bean
    public OpenAPI damierClubOpenAPI() {
        // Define the custom security scheme for X-User-Email header
        SecurityScheme securityScheme = new SecurityScheme()
                .type(SecurityScheme.Type.APIKEY)
                .in(SecurityScheme.In.HEADER)
                .name("X-User-Email")
                .description("Email de l'utilisateur authentifié");

        SecurityRequirement securityRequirement = new SecurityRequirement()
                .addList("X-User-Email");

        return new OpenAPI()
                .info(new Info()
                        .title("DamierClub API")
                        .version("1.0.0")
                        .description("API REST pour la gestion de l'application DamierClub - Back Office\n\n" +
                                "Cette API permet de gérer les membres, clubs, articles et notes de l'application.\n\n" +
                                "**Authentification**: La plupart des endpoints nécessitent l'en-tête `X-User-Email` " +
                                "contenant l'email de l'utilisateur authentifié.")
                        .contact(new Contact()
                                .name("DamierClub Team")
                                .email("contact@damierclub.com"))
                        .license(new License()
                                .name("MIT License")
                                .url("https://opensource.org/licenses/MIT")))
                .components(new Components()
                        .addSecuritySchemes("X-User-Email", securityScheme))
                .addSecurityItem(securityRequirement)
                .tags(Arrays.asList(
                        new Tag().name("Members").description("Gestion des membres - CRUD complet, recherche et statistiques"),
                        new Tag().name("Clubs").description("Gestion des clubs - CRUD complet, recherche par ville et statistiques"),
                        new Tag().name("Articles").description("Gestion des articles - CRUD complet, publication, archivage et statistiques"),
                        new Tag().name("Notes").description("Gestion des notes personnelles - CRUD complet, épinglage et statistiques")
                ));
    }
}
