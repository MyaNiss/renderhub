package app.back.code.user.service;

import app.back.code.user.dto.UserDTO;
import app.back.code.user.entity.UserAccountEntity;
import app.back.code.user.entity.UserBankEntity;
import app.back.code.user.repository.UserBankRepository;
import app.back.code.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserBankService {

    private final UserBankRepository userBankRepository;
    private final UserRepository userRepository;

    @Transactional
    public UserBankEntity saveOrUpdateBankInfo(String userId, UserDTO dto) {

        UserAccountEntity user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        return userBankRepository.findById(userId)
                .map(bank -> {
                    bank.updateBankInfo(dto.getBankName(), dto.getAccountNumber(), dto.getAccountHolder());
                    return bank;
                })
                .orElseGet(() -> {
                    UserBankEntity newBank = UserBankEntity.builder()
                            .user(user)
                            .bankName(dto.getBankName())
                            .accountNumber(dto.getAccountNumber())
                            .accountHolder(dto.getAccountHolder())
                            .build();
                    return userBankRepository.save(newBank);
                });
    }

    public UserBankEntity findBankInfo(String userId) {
        return userBankRepository.findById(userId).orElse(null);
    }
}
