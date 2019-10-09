package com.example.adminserver;

import java.time.Duration;
import java.util.Collections;
import java.util.List;

import org.springframework.beans.factory.ObjectProvider;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;
import org.springframework.http.HttpHeaders;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.web.authentication.SavedRequestAwareAuthenticationSuccessHandler;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;

import de.codecentric.boot.admin.server.config.AdminServerProperties;
import de.codecentric.boot.admin.server.config.EnableAdminServer;
import de.codecentric.boot.admin.server.domain.entities.InstanceRepository;
import de.codecentric.boot.admin.server.notify.CompositeNotifier;
import de.codecentric.boot.admin.server.notify.Notifier;
import de.codecentric.boot.admin.server.notify.RemindingNotifier;
import de.codecentric.boot.admin.server.notify.filter.FilteringNotifier;
import de.codecentric.boot.admin.server.web.client.HttpHeadersProvider;

@SpringBootApplication
@Configuration
@EnableAutoConfiguration
@EnableAdminServer
@EnableDiscoveryClient
@ComponentScan(basePackages = "com.example")
public class AdminServerApplication {

	public static void main(String[] args) {
		SpringApplication.run(AdminServerApplication.class, args);
	}
	
//	@Configuration
//	public static class SecurityPermitAllConfig extends WebSecurityConfigurerAdapter {
//	    @Override
//	    protected void configure(HttpSecurity http) throws Exception {
//	        http.authorizeRequests()
//				.anyRequest()
//				.permitAll()  
//	            .and()
//				.csrf()
//				.disable();
//	    }
//	}
//	@Profile("insecure")
//    @Configuration
//    public static class SecurityPermitAllConfig extends WebSecurityConfigurerAdapter {
//        private final String adminContextPath;
//
//        public SecurityPermitAllConfig(AdminServerProperties adminServerProperties) {
//            this.adminContextPath = adminServerProperties.getContextPath();
//        }
//
//        @Override
//        protected void configure(HttpSecurity http) throws Exception {
//            http.authorizeRequests()
//                .anyRequest()
//                .permitAll()
//                .and()
//                .csrf()
//                .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
//                .ignoringAntMatchers(adminContextPath + "/instances", adminContextPath + "/actuator/**");
//        }
//    }
//
//    @Profile("secure")
    // tag::configuration-spring-security[]
    @Configuration
    public static class SecuritySecureConfig extends WebSecurityConfigurerAdapter {
        private final String adminContextPath;

        public SecuritySecureConfig(AdminServerProperties adminServerProperties) {
            this.adminContextPath = adminServerProperties.getContextPath();
        }

        @Override
        protected void configure(HttpSecurity http) throws Exception {
            // @formatter:off
            SavedRequestAwareAuthenticationSuccessHandler successHandler = new SavedRequestAwareAuthenticationSuccessHandler();
            successHandler.setTargetUrlParameter("redirectTo");
            successHandler.setDefaultTargetUrl(adminContextPath + "/");

            http.authorizeRequests()
                .antMatchers(adminContextPath + "/assets/**").permitAll() // <1>
                .antMatchers(adminContextPath + "/login").permitAll()
                .anyRequest().authenticated() // <2>
                .and()
            .formLogin().loginPage(adminContextPath + "/login").successHandler(successHandler).and() // <3>
            .logout().logoutUrl(adminContextPath + "/logout").and()
            .httpBasic().and() // <4>
            .csrf()
                .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())  // <5>
                .ignoringAntMatchers(
                    adminContextPath + "/instances",   // <6>
                    adminContextPath + "/actuator/**"  // <7>
                );
            // @formatter:on
        }
    }
    // end::configuration-spring-security[]

    // tag::customization-instance-exchange-filter-function[]
//    @Bean
//    public InstanceExchangeFilterFunction auditLog() {
//        return (instance, request, next) -> {
//            if (HttpMethod.DELETE.equals(request.method()) || HttpMethod.POST.equals(request.method())) {
//                log.info("{} for {} on {}", request.method(), instance.getId(), request.url());
//            }
//            return next.exchange(request);
//        };
//    }
    // end::customization-instance-exchange-filter-function[]

//    @Bean
//    public CustomNotifier customNotifier(InstanceRepository repository) {
//        return new CustomNotifier(repository);
//    }

//    @Bean
//    public CustomEndpoint customEndpoint() {
//        return new CustomEndpoint();
//    }

    // tag::customization-http-headers-providers[]
    @Bean
    public HttpHeadersProvider customHttpHeadersProvider() {
        return  instance -> {
            HttpHeaders httpHeaders = new HttpHeaders();
            httpHeaders.add("username", "root");
            httpHeaders.add("password", "123456");
            return httpHeaders;
        };
    }
    // end::customization-http-headers-providers[]


    // tag::configuration-filtering-notifier[]
    @Configuration
    public static class NotifierConfig {
        private final InstanceRepository repository;
        private final ObjectProvider<List<Notifier>> otherNotifiers;

        public NotifierConfig(InstanceRepository repository, ObjectProvider<List<Notifier>> otherNotifiers) {
            this.repository = repository;
            this.otherNotifiers = otherNotifiers;
        }

        @Bean
        public FilteringNotifier filteringNotifier() { // <1>
            CompositeNotifier delegate = new CompositeNotifier(otherNotifiers.getIfAvailable(Collections::emptyList));
            return new FilteringNotifier(delegate, repository);
        }

        @Primary
        @Bean(initMethod = "start", destroyMethod = "stop")
        public RemindingNotifier remindingNotifier() { // <2>
            RemindingNotifier notifier = new RemindingNotifier(filteringNotifier(), repository);
            notifier.setReminderPeriod(Duration.ofMinutes(10));
            notifier.setCheckReminderInverval(Duration.ofSeconds(10));
            return notifier;
        }
    }
	
	
    /*notifier configuration*/
    
//	@Configuration
//	public static class NotifierConfig {
//	    private final InstanceRepository repository;
//	    private final ObjectProvider<List<Notifier>> otherNotifiers;
//
//	    public NotifierConfig(InstanceRepository repository, ObjectProvider<List<Notifier>> otherNotifiers) {
//	        this.repository = repository;
//	        this.otherNotifiers = otherNotifiers;
//	    }
//
//	    @Bean
//	    public FilteringNotifier filteringNotifier() { 
//	        CompositeNotifier delegate = new CompositeNotifier(otherNotifiers.getIfAvailable(Collections::emptyList));
//	        return new FilteringNotifier(delegate, repository);
//	    }
//
//	    @Primary
//	    @Bean(initMethod = "start", destroyMethod = "stop")
//	    public RemindingNotifier remindingNotifier() { 
//	        RemindingNotifier notifier = new RemindingNotifier(filteringNotifier(), repository);
//	        notifier.setReminderPeriod(Duration.ofMinutes(10));
//	        notifier.setCheckReminderInverval(Duration.ofSeconds(10));
//	        return notifier;
//	    }
//	}
	
//	@Profile("insecure")
//    @Configuration
//    public static class SecurityPermitAllConfig extends WebSecurityConfigurerAdapter {
//        private final String adminContextPath;
//
//        public SecurityPermitAllConfig(AdminServerProperties adminServerProperties) {
//            this.adminContextPath = adminServerProperties.getContextPath();
//        }
//
//        @Override
//        protected void configure(HttpSecurity http) throws Exception {
//            http.authorizeRequests()
//                .anyRequest()
//                .permitAll()
//                .and()
//                .csrf()
//                	.csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
//                	.disable();
////                .ignoringAntMatchers(adminContextPath + "/instances", adminContextPath + "/actuator/**");
//        }
//    }
////
//    @Profile("secure")
//    @Configuration
//    public static class SecuritySecureConfig extends WebSecurityConfigurerAdapter {
//        private final String adminContextPath;
//
//        public SecuritySecureConfig(AdminServerProperties adminServerProperties) {
//            this.adminContextPath = adminServerProperties.getContextPath();
//        }
//
//        @Override
//        protected void configure(HttpSecurity http) throws Exception {
//            // @formatter:off
//            SavedRequestAwareAuthenticationSuccessHandler successHandler = new SavedRequestAwareAuthenticationSuccessHandler();
//            successHandler.setTargetUrlParameter("redirectTo");
//            successHandler.setDefaultTargetUrl(adminContextPath + "/");
//
//            http.authorizeRequests()
//                .antMatchers(adminContextPath + "/assets/**").permitAll()
//                .antMatchers(adminContextPath + "/login").permitAll()
//                .anyRequest().authenticated()
//                .and()
//            .formLogin().loginPage(adminContextPath + "/login").successHandler(successHandler).and()
//            .logout().logoutUrl(adminContextPath + "/logout").and()
////            .httpBasic()
////            .and()
//            .csrf()
//                .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
////                .disable();
//                .ignoringAntMatchers(adminContextPath + "/instances", adminContextPath + "/actuator/**");
//            // @formatter:on
//        }
//    }
}
