import { useEffect, useRef, useState } from 'react';
import { Input } from 'reactstrap';
import OneWayButton from '../../../components/forms/OneWayButton';
import { UserService } from '../../account/services/UserService';
import s from './EditProfileForm.module.css';
import type { UpdateProfilePatch, UserProfile } from '../../account/types';
import defaultAvatarUrl from '../../../assets/feed_profile.jpg';
import { FiEdit2 } from 'react-icons/fi';
import CenterSnackbar from '../../../components/feedback/CenterSnackbar';

const isEqual = (a: any, b: any) =>
  Array.isArray(a) && Array.isArray(b)
    ? a.length === b.length && a.every((v, i) => v === b[i])
    : a === b;

function diffPatch(orig: UserProfile, edits: UpdateProfilePatch): UpdateProfilePatch {
  const out: UpdateProfilePatch = {};
  (Object.keys(edits) as (keyof UpdateProfilePatch)[]).forEach((k) => {
    const v = edits[k];
    if (v !== undefined && !isEqual(v, (orig as any)[k])) out[k] = v as any;
  });
  return out;
}

type EditProfileFormProps = {
  onSubmit: () => void;
}

export default function EditProfileForm({
  onSubmit
} : EditProfileFormProps) {
  const [orig, setOrig] = useState<UserProfile | null>(null);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [pendingAvatarFile, setPendingAvatarFile] = useState<File | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [error, setError] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [snackOpen, setSnackOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const openPicker = () => fileInputRef.current?.click();

  useEffect(() => {
    (async () => {
      try {
        const p = await UserService.getMyProfile();
        setOrig(p);
        setAvatarUrl(p.avatarUrl ?? '');
        setDisplayName(p.displayName ?? '');
        setBio(p.bio ?? '');
      } catch {
        setError(true);
      }
    })();
  }, []);

  useEffect(() => {
    return () => { if (avatarPreview) URL.revokeObjectURL(avatarPreview); };
  }, [avatarPreview]);

  const onAvatarFileChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { alert('이미지 파일만 가능합니다.'); return; }
    if (file.size > 5 * 1024 * 1024) { alert('5MB 이하 파일만 가능합니다.'); return; }

    if (avatarPreview) {
      URL.revokeObjectURL(avatarPreview);
    }

    const localUrl = URL.createObjectURL(file);
    setAvatarPreview(localUrl);
    setPendingAvatarFile(file);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSave = async () => {
    if (!orig) { return; }
    setIsSaving(true);

    try {
      let nextAvatarUrl = avatarUrl;

      if (pendingAvatarFile) {
        const uploaded = await UserService.uploadAvatar(pendingAvatarFile);
        nextAvatarUrl = typeof uploaded === 'string' ? uploaded : (uploaded?.avatarUrl ?? '');
        if (!nextAvatarUrl) throw new Error('Invalid upload response');
      }

      const patch = diffPatch(orig, {
        avatarUrl: nextAvatarUrl.trim(),
        displayName: displayName.trim(),
        bio: bio.trim(),
      });

      if (Object.keys(patch).length > 0) {
        await UserService.updateMyProfile(patch);
        setOrig({ ...orig, ...patch });
        setAvatarUrl(nextAvatarUrl);
      }

      if (avatarPreview) { URL.revokeObjectURL(avatarPreview); }
      setAvatarPreview(null);
      setPendingAvatarFile(null);

      <CenterSnackbar
        open={snackOpen}
        message="저장이 완료되었습니다."
        variant="info"
        duration={3000}
        onClose={() => setSnackOpen(false)}/>

        onSubmit();
    } catch (e) {
      alert('저장에 실패했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsSaving(false);
    }
  };

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <p>일시적인 장애로 사용자 정보를 불러올 수 없습니다.</p>
      </div>
    );
  }
  if (!orig) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <p>로딩 중 ...</p>
      </div>
    );
  }

  const imgSrc = avatarPreview ?? (avatarUrl || defaultAvatarUrl);

  return (
    <div className={s['form-layout']}>
      {/* avatar */}
      <div className={s['avatar-wrapper']}>
        <button
          type="button"
          className={`${s['avatar-button']} ${isSaving ? s['avatar-button--busy'] : ''}`}
          aria-label="프로필 사진 변경"
          onClick={openPicker}
          disabled={isSaving}>
          <img className={s['avatar']} src={imgSrc} alt="profile" />
          <span className={s['avatar-edit']}>
            <FiEdit2 aria-hidden="true" />
          </span>

          {/* 저장 중일 때만 테두리 스피너 */}
          {isSaving && <span className={s['avatar-spinner']} aria-hidden="true" />}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={onAvatarFileChange}
          style={{ display: 'none' }}
          disabled={isSaving}
        />
      </div>

      {/* displayName */}
      <div className={s['profile-display-name']}>
        <div className={s['profile-display-name-tag']}><span>이름</span></div>
        <div className={s['profile-display-name-input']}>
          <Input
            type="text"
            value={displayName}
            maxLength={40}
            placeholder="표시 이름을 입력하세요"
            onChange={(e) => setDisplayName(e.target.value)}
            disabled={isSaving}
          />
        </div>
      </div>

      {/* bio */}
      <div className={s['profile-bio']}>
        <div className={s['profile-bio-tag']}><span>소개</span></div>
        <div className={s['profile-bio-input']}>
          <Input
            type="textarea"
            value={bio}
            maxLength={200}
            placeholder="간단한 소개를 입력하세요"
            onChange={(e) => setBio(e.target.value)}
            disabled={isSaving}
          />
        </div>
      </div>

      {/* save */}
      <div className={s['form-action']}>
        <OneWayButton
          responsiveType="fluid"
          widthSizeType="lg"
          heightSizeType="lg"
          colorType="natural"
          content="저장하기"
          disabled={isSaving || displayName.trim().length === 0}
          onClick={handleSave}
        />
      </div>
    </div>
  );
}

