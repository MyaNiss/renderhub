package app.back.code.user.service;

import app.back.code.article.repository.ArticleRepository;
import app.back.code.post.repository.PostRepository;
import app.back.code.user.dto.UserDTO;
import app.back.code.user.entity.UserAccountEntity;
import app.back.code.user.entity.UserBankEntity;
import app.back.code.user.entity.UserRoleEntity;
import app.back.code.user.repository.UserBankRepository;
import app.back.code.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {
    private final UserRepository userRepository;
    private final UserBankRepository userBankRepository;
    private final PostRepository postRepository;
    private final ArticleRepository articleRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserRoleService roleService;

    @Transactional
    public UserDTO saveUser(UserDTO dto) {
        if(userRepository.existsByUserId(dto.getUserId())){
            throw new IllegalArgumentException("이미 사용 중인 아이디입니다");
        }
        if(userRepository.existsByEmail(dto.getEmail())){
            throw new IllegalArgumentException("이미 사용중인 메일입니다");
        }

        String encryptedPassword = passwordEncoder.encode(dto.getPassword());
        UserRoleEntity defaultRole = roleService.findDefaultRole();

        UserAccountEntity user = dto.toEntity(defaultRole, encryptedPassword);
        UserAccountEntity savedUser = userRepository.save(user);

        return UserDTO.from(savedUser);
    }

    @Transactional
    public UserDTO updateUser(String currentUserId, UserDTO dto) {
        UserAccountEntity user = userRepository.findById(currentUserId).orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다"));

        user.setNickname(dto.getNickname());
        user.setName(dto.getName());
        user.setPhone(dto.getPhone());
        user.setContnets(dto.getContents());

        return UserDTO.from(user);
    }

    @Transactional
    public void deleteUser(String currentUserId) {
        UserAccountEntity user = userRepository.findById(currentUserId).orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다"));
        user.delete();
    }

    public UserDTO findPrivateUserById(String userId) {
        UserAccountEntity user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다"));

        UserBankEntity bank = userBankRepository.findById(userId).orElse(null);

        return UserDTO.builder()
                .nickname(user.getNickname())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .bankName(bank != null ? bank.getBankName() : null)
                .accountNumber(bank != null ? bank.getAccountNumber() : null)
                .accountHolder(bank != null ? bank.getAccountHolder() : null)
                .build();
    }

    public UserDTO findPublicUserById(String userId) {
        UserAccountEntity user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다"));

        List<Long> postIds = postRepository.findPostIdByWriter_UserId(userId);
        List<Long> articleIds = articleRepository.findArticleIdByWriter_UserId(userId);

        return UserDTO.builder()
                .userId(user.getUserId())
                .nickname(user.getNickname())
                .contents(user.getContnets())
                .registDate(user.getRegistDate())
                .postIds(postIds)
                .articleIds(articleIds)
                .build();
    }


}
