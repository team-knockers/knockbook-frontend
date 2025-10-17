import { Input, Label } from "reactstrap";
import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { FiCamera, FiX } from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import { PATHS } from "../../routes/paths";

import OneWayButton from "../../components/forms/OneWayButton";

import { validateFiles } from "../../utils/fileValidators";
import { CustomerService } from "../../features/customer/services/CustomerService";
import { ApiError } from "../../types/http";

import "react-toastify/dist/ReactToastify.css";
import s from "./QnARegisterPage.module.css";

export default function QnARegisterPage() {

  const nav = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPolicyChecked, setIsPolicyChecked] = useState(false);
  const [numLetters, setNumLetters] = useState(0);  
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [canProceed, setCanProceed] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const previews = useMemo(
    () => files.map(f => ({ file: f, url: URL.createObjectURL(f)})),
    [files]
  );

  useEffect(() => {
    return () => previews.forEach(p => URL.revokeObjectURL(p.url));
  }, [previews]);
  
  useEffect(() => {
    if (errors.length === 0) { return; }
    [...new Set(errors)].forEach(msg => toast.error(msg));
  }, [errors]);

  useEffect(() => {
    const ok =
      title.trim().length > 0 &&
      content.trim().length > 0 &&
      isPolicyChecked;
    setCanProceed(ok);
  }, [title, content, isPolicyChecked]);

  const handleFileInputChange = 
  (e : ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) { return; }
    const incoming = Array.from(e.target.files);
    const { accepted, errors } = validateFiles(files, incoming);

    setFiles(prev => [...prev, ...accepted]);
    setErrors(errors);
    e.target.value = "";
  }

  async function handleSubmit() {
    try {
      await CustomerService.RegisterQnA(title, content, files);
      nav(PATHS.listQnA);
    } catch (e) {
      if (e instanceof ApiError) {
        console.error(e.problem.title);
      }
    }
  }

  return (
    <div className={s['subpage-layout']}>
      {/* title */}
      <div className={s['qna-title-wrapper']}>
        <Label
          className={s["qna-title-label"]}
          for="qna-title-input"
          type="text">
          제목
        </Label>
        <Input
          className={s["qna-title-input"]}
          id="qna-title-input"
          type="text"
          value={title}
          placeholder="제목을 입력하세요"
          required
          onChange={e => setTitle(e.target.value)}>
        </Input>
      </div>
      {/* content */}
      <div className={s['qna-content-wrapper']}>
        <Label
          className={s["qna-content-label"]}
          for="qna-content-input"
          type="text">
          내용
        </Label>
        <div className={s['qna-content-group']}>
          <Input
            className={s["qna-content-input"]}
            id="qna-content-input"
            tag="textarea"
            value={content}
            placeholder="내용을 입력하세요"
            required
            onChange={e => {
              const next = e.target.value.slice(0, 300);
              setContent(next);
              setNumLetters(next.length);
            }}>
          </Input>
          <div className={s['qna-content-counter']}>
            {`${numLetters} / 300자`}
          </div>
        </div>
      </div>
      <div className={s['qna-file-wrapper']}>
        <Input
          innerRef={fileInputRef} 
          type="file"
          accept=".gif, .png, .jpg, .jpeg" 
          multiple
          onChange={handleFileInputChange}
          style={{ display: "none" }}>
        </Input>
        {/* file attachment */}
        <div
          className={s['qna-attach-button-layout']}
          role="button"
          tabIndex={0}
          onClick={() => fileInputRef.current?.click()}>
            <FiCamera className={s['qna-attach-button-icon']}/>
            <span className={s['qna-attach-button-content']}>
              첨부하기
            </span>
        </div>
        {/* file attachment guide */}
        <div className={s['qna-file-guide']}>
          <span>
            - 첨부 파일은 최대 20MB 이내, 3개까지 첨부 가능합니다.<br/> 
            - 파일 형식은 gif, png, jpg, jpeg 형식이 가능합니다.
          </span>
        </div>
        {/* thumbnail images */}
        {files.length > 0 &&
        <div className={s['qna-preview-wrapper']}>
          {previews.map(({file, url}) => (
            <div className={s['qna-preview-layer']}>
              <img
                className={s['qna-preview-img']}
                src={url}
                alt={file.name} />
              <button
                className={s['qna-preview-img-close-button']}
                onClick={() => setFiles(prev => 
                  prev.filter(f => f.name !== file.name))}>
                  <FiX />
              </button>
            </div>
          ))}
        </div>}
        {/* error modal */}
        <ToastContainer
          position="top-center"
          autoClose={2000}
          pauseOnHover />
      </div>
      {/* policy */}
      <div className={s['qna-policy-wrapper']}>
        <Label check>
        <Input
          className={s['qna-policy-checkbox']}
          type="checkbox"
          checked={isPolicyChecked}
          onChange={e => setIsPolicyChecked(e.target.checked)}/>
          [필수] 개인정보 수집 및 이용 동의
        </Label>
      </div>
      {/* proceed */}
      <OneWayButton
        responsiveType="fluid"
        widthSizeType="lg"
        heightSizeType="lg"
        colorType="dark"
        content="등록하기"
        onClick={handleSubmit}
        disabled={!canProceed}
      />
    </div>
  );
}
