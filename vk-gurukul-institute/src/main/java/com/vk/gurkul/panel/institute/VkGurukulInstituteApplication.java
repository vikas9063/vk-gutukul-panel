package com.vk.gurkul.panel.institute;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.CrossOrigin;

@SpringBootApplication
@CrossOrigin(origins = "*")
public class VkGurukulInstituteApplication {

	public static void main(String[] args) {
		SpringApplication.run(VkGurukulInstituteApplication.class, args);
		System.out.println("Institute Service Started ....");
	}

}
