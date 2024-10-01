package com.server.reveal;

import org.glassfish.jersey.server.ResourceConfig;
import org.springframework.stereotype.Component;
import com.infragistics.reveal.engine.init.InitializeParameterBuilder;
import com.infragistics.reveal.engine.init.RevealEngineInitializer;
import com.infragistics.reveal.sdk.api.RVDashboardProvider;

import jakarta.ws.rs.ApplicationPath;

@Component
@ApplicationPath("/")
public class RevealJerseyConfig extends ResourceConfig {
    public RevealJerseyConfig() {
        RevealEngineInitializer.initialize(new InitializeParameterBuilder()
            .setAuthProvider(new AuthenticationProvider())
            .setDataSourceProvider(new DataSourceProvider())
            .setDashboardProvider(new RevealDashboardProvider())
            //.setDashboardProvider(new RVDashboardProvider("C:\\Dev-Reveal\\Features\\DOM - Java\\java\\Dashboards"))
            .setUserContextProvider(new UserContextProvider())
            .setObjectFilter(new RevealObjectFilter())
            .build());

        for (Class<?> clazz : RevealEngineInitializer.getClassesToRegister()) {
            register(clazz);
        }

        register(CorsFilter.class);
        register(DomController.class);
    }
}