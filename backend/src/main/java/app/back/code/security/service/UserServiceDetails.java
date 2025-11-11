package app.back.code.security.service;

import app.back.code.security.dto.UserSecureDTO;
import app.back.code.user.entity.UserAccountEntity;
import app.back.code.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@RequiredArgsConstructor
public class UserServiceDetails implements UserDetailsService{
  
    private final UserRepository userRepository;

    private static final String ROLE_PREFIX = "ROLE_";
  
    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        UserAccountEntity user =
            userRepository.findById(username)
            .orElseThrow(() -> new UsernameNotFoundException(username + "을 찾을 수 없습니다."));

        String fullRoleName = user.getRole().getName();

        String strippedRole = fullRoleName.startsWith(ROLE_PREFIX) ? fullRoleName.substring(ROLE_PREFIX.length()) : fullRoleName;

        return new UserSecureDTO(
                user.getUserId(),
                user.getName(),
                user.getPassword(),
                strippedRole,
                user.isDeleted());
    }

}
