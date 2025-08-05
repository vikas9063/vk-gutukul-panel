package com.vk.gurkul.panel.users.entity;

import java.util.Collection;
import java.util.HashSet;
import java.util.Set;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinTable;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "users")
public class UserEntity implements UserDetails {

	private static final long serialVersionUID = 4791109508954857309L;

	@Id
	@Column(nullable = false)
	private String userId;
	@Column(nullable = false)
	private String userEmail;
	@Column(nullable = false)
	private boolean isEnabled;
	@Column(nullable = false, length = 15)
	private String mobileNo;

	@Column(nullable = false, length = 255)
	private String password;

	@Column(nullable = false)
	private String userRegDate;
	private boolean isDeleted;

	
	@OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
	@JsonIgnore
	private RefreshTokenEntity refreshToken;

//	@JsonIgnore
	@OneToMany(mappedBy = "users", cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true)
	private Set<UserRoleMapEntity> userRoles = new HashSet<UserRoleMapEntity>();

	@ManyToMany(fetch = FetchType.EAGER)
	@JoinTable(name = "user_permissions", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "permission_id"))
	private Set<PermissionEntity> userPermissions = new HashSet<>();

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		Set<GrantedAuthority> authorities = new HashSet<>();

		// Role authorities (prefixed)
		this.userRoles.forEach(userRoleMap -> {
			RoleEntity role = userRoleMap.getRoles();
			role.getPermissions()
					.forEach(permission -> authorities.add(new SimpleGrantedAuthority(permission.getPermissionName())));
		});

		// User-specific direct permissions
		this.userPermissions
				.forEach(permission -> authorities.add(new SimpleGrantedAuthority(permission.getPermissionName())));

		return authorities;
	}

	@Override
	public String getPassword() {
		return this.password;
	}

	@Override
	public String getUsername() {
		return this.userEmail;
	}

	@Override
	public boolean isAccountNonExpired() {
		return true;
	}

	@Override
	public boolean isAccountNonLocked() {
		return !isDeleted;
	}

	@Override
	public boolean isCredentialsNonExpired() {
		return true;
	}

}
