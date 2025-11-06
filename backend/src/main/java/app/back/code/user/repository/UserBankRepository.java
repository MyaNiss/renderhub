package app.back.code.user.repository;

import app.back.code.user.entity.UserBankEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserBankRepository extends JpaRepository<UserBankEntity, String> {

}
