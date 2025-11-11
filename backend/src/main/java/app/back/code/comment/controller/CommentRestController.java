package app.back.code.comment.controller;

import app.back.code.comment.CommentService;
import app.back.code.comment.dto.CommentDTO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/comments")
public class CommentRestController {

    private final CommentService commentService;

    @GetMapping("/{resourceType}/{parentId}")
    public ResponseEntity<Page<CommentDTO>> getCommentList(
            @PathVariable("resourceType")String targetType,
            @PathVariable("parentId")Long targetId,
            @RequestParam(defaultValue = "0") int currentPage,
            @RequestParam(defaultValue = "5") int pagePerRows
    ) {
        Pageable pageable = PageRequest.of(currentPage, pagePerRows);

        Page<CommentDTO> list = commentService.getCommentlist(
                targetType.toUpperCase(),
                targetId,
                pageable);

        return ResponseEntity.ok(list);
    }

    @PostMapping("/{resourceType}/{parentId}")
    public ResponseEntity<CommentDTO> writeComment(
            @PathVariable("resourceType")String targetType,
            @PathVariable("parentId")Long targetId,
            @ModelAttribute CommentDTO request,
            @AuthenticationPrincipal String currentUserId
    ){
        request.setTargetType(targetType.toUpperCase());
        request.setTargetId(targetId);

        CommentDTO createdComment = commentService.createComment(request, currentUserId);

        return ResponseEntity.status(HttpStatus.CREATED).body(createdComment);
    }

    @PutMapping("/{commentId}")
    public ResponseEntity<CommentDTO> updateComment(
            @PathVariable Long commentId,
            @ModelAttribute CommentDTO request,
            @AuthenticationPrincipal String currentUserId
    ) {

        CommentDTO updatedComment = commentService.updateComment(commentId, request,  currentUserId);

        return  ResponseEntity.ok(updatedComment);
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<Void> deleteComment(
            @PathVariable Long commentId,
            @AuthenticationPrincipal String currentUserId
    ) {
        commentService.deleteComment(commentId, currentUserId);

        return ResponseEntity.noContent().build();
    }
}
