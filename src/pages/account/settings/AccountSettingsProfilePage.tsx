import { Label, Input, InputGroup, InputGroupText } from 'reactstrap';
import { Navigate, useLocation, useRevalidator } from 'react-router-dom';
import { useEffect, useState } from 'react';

import { UserService } from '../../../features/account/services/UserService';
import { ApiError } from '../../../types/http';
import { 
  checkPasswordAlphaLetter,
  checkPasswordDigit,
  checkPasswordLength,
  checkPasswordSpecialLetter,
  isPasswordValid } from '../../../utils/userProfileValidators';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import FeedProfileFallback from '../../../assets/feed_profile.jpg';

import OneWayButton from '../../../components/forms/OneWayButton';
import s from './AccountSettingsProfilePage.module.css';
import Item from '../../../components/display/Item';
import CenterSnackbar from '../../../components/feedback/CenterSnackbar';
import { PATHS } from '../../../routes/paths';
import { ensureUser } from '../../../shared/authReady';
import type { UserProfile } from '../../../features/account/types';

export default function AccountSettingsProfilePage() {

  const { revalidate } = useRevalidator();
  const loc = useLocation();
  
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [displayName, setDisplayName] = useState("");
  const [isPasswordDisabled] = useState(true);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [canProceed, setCanProceed ] = useState(false);

  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMsg, setSnackMsg] = useState("");
  const [snackVariant, setSnackVariant] = useState<"info"|"success"|"warn"|"error">("info");

  // load data
  useEffect(() => {
    (async () => {
      try {
        const me = await ensureUser();
        setUser(me);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // sync displayname
  useEffect(() => {
    if (user) setDisplayName(user.displayName ?? "");
  }, [user]);

  const isValid = isPasswordValid(newPassword);
  const isMatch = confirmPassword.length > 0 && newPassword === confirmPassword;  
  useEffect(() => setCanProceed(isValid && isMatch), [newPassword, confirmPassword]);

  if (loading) { return null; }
  if (!user) { return <Navigate to={PATHS.login} replace state={{ from: loc }} />; }
  const avatarUrl = user.avatarUrl?.trim() || FeedProfileFallback;
  
  async function changeDisplayName() {
    try {
      await UserService.changeDisplayName(displayName);
      setSnackMsg("변경이 완료되었습니다.");
      setSnackVariant("success");
      setSnackOpen(false);
      setTimeout(() => setSnackOpen(true), 0);
      revalidate();
    } catch (e) {
      if (e instanceof ApiError) {
        setSnackMsg("변경에 실패했습니다. 잠시 후 다시 시도해주세요.");
        setSnackVariant("error");
        setSnackOpen(false);
        setTimeout(() => setSnackOpen(true), 0);
      }
    }
  }

  async function changePassword() {
     try {
      await UserService.changePassword(newPassword);
      setSnackMsg("변경이 완료되었습니다.");
      setSnackVariant("success");
      setSnackOpen(false);
      setTimeout(() => setSnackOpen(true), 0);
    } catch (e) {
      if (e instanceof ApiError) {
        setSnackMsg("변경에 실패했습니다. 잠시 후 다시 시도해주세요.");
        setSnackVariant("error");
        setSnackOpen(false);
        setTimeout(() => setSnackOpen(true), 0);
      }
    }
  }

  return (
    <main className={s['page-layout']}>

      <CenterSnackbar
        open={snackOpen}
        message={snackMsg}
        variant={snackVariant}
        duration={3000}
        onClose={() => setSnackOpen(false)}/>

      <div className={s['profile-img']}>
        <img
          src={avatarUrl || FeedProfileFallback}
          alt={`${displayName || '프로필'} 이미지`} />
      </div>
      <div className={s['profile-form-wrapper']}>
        {/* email - readonly */}
        <div className={s['email-wrapper']}>
          <Label className={s['email-label']}>
            이메일
          </Label>
          <Input 
            className={s['email-input']}
            value={user.email}
            disabled
            readOnly/>
        </div>
        {/* name - editable */}
        <div className={s['name-wrapper']}>
          <Label className={s['name-label']}>
            이름
          </Label>
          <div className={s['name-input-wrapper']}>
            <Input 
              className={s['name-input']}
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}/>
            <OneWayButton
              content='변경하기'
              responsiveType='fixed'
              colorType='dark'
              widthSizeType='sm'
              heightSizeType='sm'
              onClick={changeDisplayName}/>
          </div>
        </div>
        {/* password - editable */}
        { !isEditingPassword ? (
          <div className={s['password-wrapper-disabled']}>
            <Label className={s['password-label']}>
              비밀번호
            </Label>
            <div className={s['password-input-wrapper']}>
              <Input 
                className={s['password-input']}
                type="password"
                value="********"
                disabled={isPasswordDisabled}/>
              <OneWayButton
                content='변경하기'
                responsiveType='fixed'
                colorType='dark'
                widthSizeType='sm'
                heightSizeType='sm'
                onClick={() => setIsEditingPassword(true)}/>
            </div>
          </div>
        ) : (
          <div className={s['password-wrapper-enabled']}>
             <div className={s['current-password-wrapper']}>
                <Label 
                  className={s['password-label']}
                  for="current-password-input">
                    현재 비밀번호
                </Label>
                <InputGroup className={s['current-password-input-wrapper']}>
                  <Input 
                    className={s['password-input']}
                    id="current-password-input"
                    type={showCurrentPassword ? 'text' : 'password'}
                    placeholder="비밀번호를 입력하세요"
                    value={currentPassword}
                    onChange={e => setCurrentPassword(e.target.value)}/>
                  <InputGroupText
                    className={s['show-icon']}
                    onClick={() => setShowCurrentPassword(prev => !prev)}>
                      {showCurrentPassword ? <FiEyeOff /> : <FiEye />}
                  </InputGroupText>
                </InputGroup>
              </div>
              <div className={s['new-password-wrapper']}>
                <Label 
                  className={s['password-label']}
                  for="new-password-input"
                  type="text">
                    비밀번호 입력
                </Label>
                <InputGroup>
                  <Input 
                    className={s['password-input']}
                    id="new-password-input"
                    type={showNewPassword ? 'text' : 'password'}
                    placeholder="비밀번호를 입력하세요"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    valid={newPassword !== '' && isPasswordValid(newPassword)}
                    invalid={newPassword !== '' && !isPasswordValid(newPassword)}/>
                  <InputGroupText
                    className={s['show-icon']}
                    onClick={() => setShowNewPassword(prev => !prev)}>
                      {showNewPassword ? <FiEyeOff /> : <FiEye />}
                  </InputGroupText>
                </InputGroup>
                <div className={s['password-request-wrapper']}>
                  <Item ok={checkPasswordLength(newPassword)}>8-12자</Item>
                  <Item ok={checkPasswordAlphaLetter(newPassword)}>영문</Item>
                  <Item ok={checkPasswordDigit(newPassword)}>숫자</Item>
                  <Item ok={checkPasswordSpecialLetter(newPassword)}>특수문자</Item>
                </div>
              </div>
              <div className={s['confirm-password-wrapper']}>
                <Label 
                  className={s['password-label']}
                  for="confirm-password-input">
                    비밀번호 확인
                </Label>
                <div className={s['password-input-wrapper']}>                  
                  <InputGroup>
                    <Input 
                      className={s['password-input']}
                      id="confirm-password-input"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="비밀번호를 입력하세요"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      valid={confirmPassword !== '' && isMatch}
                      invalid={confirmPassword !== '' && !isMatch}/>
                    <InputGroupText
                      className={s['show-icon']}
                      onClick={() => setShowConfirmPassword(prev => !prev)}>
                        {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                    </InputGroupText>
                  </InputGroup>
                  <OneWayButton
                    content='변경하기'
                    responsiveType='fixed'
                    colorType='dark'
                    widthSizeType='sm'
                    heightSizeType='sm'
                    disabled={!canProceed}
                    onClick={changePassword}/>
                </div>
              </div>
          </div>
        )}
      </div>
      {/* delete account */}
      <button
        className={s['delete-account-button']}
        onClick={() => {/* TODO */}}>
        탈퇴하기
      </button>
    </main>
  );
}
