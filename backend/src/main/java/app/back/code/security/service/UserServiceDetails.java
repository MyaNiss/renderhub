package app.back.code.security.service;

import app.back.code.security.dto.UserSecureDTO;
import app.back.code.security.entity.UserEntity;
import app.back.code.security.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class UserServiceDetails implements UserDetailsService{
  
    private final UserRepository userRepository;
  
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        UserEntity user =
            userRepository.findById(username)
            .orElseThrow(() -> new UsernameNotFoundException(username + "을 찾을 수 없습니다."));

        return new UserSecureDTO(user.getUserId(), user.getNames(),
                        user.getPasswd(), user.getRole().getRoleId());
    }

}
