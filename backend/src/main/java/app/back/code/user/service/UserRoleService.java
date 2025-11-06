package app.back.code.user.service;

import app.back.code.user.entity.UserRoleEntity;
import app.back.code.user.repository.UserRoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserRoleService {

    private final UserRoleRepository userRoleRepository;

    private static final String DEFAULT_ROLE_NAME = "ROLE_USER";

    public UserRoleEntity findDefaultRole() {
        return userRoleRepository.findByName(DEFAULT_ROLE_NAME).orElseThrow(() -> new IllegalStateException("권한 (" + DEFAULT_ROLE_NAME + ")이 DB에 없습니다"));
    }
}
