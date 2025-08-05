package com.vk.gurkul.panel.users.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.vk.gurkul.panel.users.entity.UserEntity;
import com.vk.gurkul.panel.users.repo.UsersRepo;

@Service
public class UserInfoUserDetailsService implements UserDetailsService {

	@Autowired
	private UsersRepo usersRepo;

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		UserEntity user = usersRepo.findByUserEmailOrMobileNo(username, username)
				.orElseThrow(() -> new UsernameNotFoundException("user not found " + username));
		return user;
	}

}