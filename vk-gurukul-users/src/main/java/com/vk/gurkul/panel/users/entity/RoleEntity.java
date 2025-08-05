package com.vk.gurkul.panel.users.entity;

import java.util.HashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.JoinColumn;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "ROLES")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RoleEntity {

	@Id
//	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int roleId;
	private String roleTitle;
	private String roleDesc;
	
	
	@JsonIgnore
	@OneToMany(fetch = FetchType.EAGER, mappedBy = "roles")
	private Set<UserRoleMapEntity> userRoles = new HashSet<UserRoleMapEntity>();
	
	@ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "role_permissions",
        joinColumns = @JoinColumn(name = "role_id"),
        inverseJoinColumns = @JoinColumn(name = "permission_id")
    )
    private Set<PermissionEntity> permissions = new HashSet<>();
	
}
