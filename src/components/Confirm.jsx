/* eslint-disable react/prop-types */
export default function Confirm({ action, description, cancel, confirm }) {
  return (
    <div className="fixed flex inset-0 justify-center pt-[30%] w-screen h-fit z-[9999]">
      <div className="fixed w-[9999px] h-[9999px] top-0 left-0 backdrop-blur-sm bg-[#00000010] z-[9998]"></div>
      <div className="card z-[9999] ">
        <div className="header">
          <div className="image">
            <svg
              aria-hidden="true"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                strokeLinejoin="round"
                strokeLinecap="round"
              ></path>
            </svg>
          </div>
          <div className="content">
            <span className="title">{action}</span>
            <p className="message">{description}</p>
          </div>
          <div className="actions">
            <button className="desactivate" type="button" onClick={confirm}>
              Potwierdź
            </button>
            <button className="cancel" type="button" onClick={cancel}>
              Anuluj
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
