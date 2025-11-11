package app.back.code.user.service;

import app.back.code.article.repository.ArticleRepository;
import app.back.code.common.dto.SimplePostDTO;
import app.back.code.post.entity.PostEntity;
import app.back.code.post.repository.PostRepository;
import app.back.code.user.dto.UserDTO;
import app.back.code.user.entity.UserAccountEntity;
import app.back.code.user.entity.UserBankEntity;
import app.back.code.user.entity.UserRoleEntity;
import app.back.code.user.repository.UserBankRepository;
import app.back.code.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
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

    public boolean reAuthenticate(String userId, String currentPassword) {
        UserAccountEntity user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new UsernameNotFoundException("사용자를 찾을 수 없습니다"));

        if(!passwordEncoder.matches(currentPassword, user.getPassword())) {
            return false;
        }

        return true;
    }

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

        if(dto.getNickname() != null){
            user.setNickname(dto.getNickname());
        }

        if(dto.getName() != null) {
            user.setName(dto.getName());
        }

        if(dto.getEmail() != null) {
            user.setEmail(dto.getEmail());
        }

        if(dto.getPhone() != null) {
            user.setPhone(dto.getPhone());
        }

        if (dto.getContents() != null) {
            user.setContents(dto.getContents());
        }

        UserAccountEntity savedUser = userRepository.save(user);

        return UserDTO.from(savedUser);
    }

    @Transactional
    public void updatePassword(String userId, String currentPassword, String newPassword) {
        UserAccountEntity user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다"));

        if(!passwordEncoder.matches(currentPassword, user.getPassword())){
            throw new IllegalArgumentException("현재 비밀번호가 일치하지 않습니다");
        }

        String newEncryptedPassword = passwordEncoder.encode(newPassword);
        user.setPassword(newEncryptedPassword);
    }

    @Transactional
    public void deleteUser(String currentUserId) {
        UserAccountEntity user = userRepository.findById(currentUserId).orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다"));

        List<PostEntity> userPosts = postRepository.findAllByWriter(user);

        for(PostEntity postEntity : userPosts){
            postEntity.delete();
        }

        user.delete();

        userRepository.save(user);
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

        List<SimplePostDTO> postList = postRepository.findPostsByWriter_UserId(userId);
        List<SimplePostDTO> articleList = articleRepository.findArticlesByWriter_UserId(userId);

        return UserDTO.builder()
                .userId(user.getUserId())
                .nickname(user.getNickname())
                .email(user.getEmail())
                .contents(user.getContents() != null ? user.getContents() : "")
                .registDate(user.getRegistDate())
                .postList(postList)
                .articleList(articleList)
                .build();
    }


}
