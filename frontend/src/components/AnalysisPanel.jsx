import parsePayload from "../utils/parsePayload";

const ListSection = ({ title, items, itemRenderer }) => (
  <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
    <h4 className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-300">{title}</h4>
    <div className="mt-3 space-y-3">
      {items?.length ? items.map(itemRenderer) : <p className="text-sm text-slate-500">No items yet.</p>}
    </div>
  </div>
);

const AnalysisPanel = ({ analysis }) => {
  const data = parsePayload(analysis?.payload);

  if (!analysis) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-brand-300">{analysis.type}</p>
          <h3 className="mt-2 text-2xl font-semibold text-white">Generated Result</h3>
        </div>
      </div>

      {data?.raw ? (
        <div className="glass-panel whitespace-pre-wrap p-5 text-sm text-slate-200">{data.raw}</div>
      ) : (
        <div className="grid gap-4">
          {data?.shortSummary ? (
            <div className="glass-panel p-5">
              <h4 className="text-lg font-semibold text-white">Short Summary</h4>
              <p className="mt-3 text-slate-300">{data.shortSummary}</p>
            </div>
          ) : null}

          {data?.detailedSummary ? (
            <div className="glass-panel p-5">
              <h4 className="text-lg font-semibold text-white">Detailed Summary</h4>
              <p className="mt-3 whitespace-pre-wrap text-slate-300">{data.detailedSummary}</p>
            </div>
          ) : null}

          {data?.chapterWiseSummary ? (
            <ListSection
              title="Chapter-wise Summary"
              items={data.chapterWiseSummary}
              itemRenderer={(item, index) => (
                <div key={`${item.chapter}-${index}`}>
                  <p className="font-semibold text-white">{item.chapter}</p>
                  <p className="mt-1 text-sm text-slate-300">{item.summary}</p>
                </div>
              )}
            />
          ) : null}

          {data?.topPoints ? (
            <ListSection
              title="Top Points"
              items={data.topPoints}
              itemRenderer={(item, index) => (
                <div key={`${item}-${index}`} className="rounded-2xl bg-white/5 p-3 text-sm text-slate-300">
                  {item}
                </div>
              )}
            />
          ) : null}

          {data?.definitions ? (
            <ListSection
              title="Definitions"
              items={data.definitions}
              itemRenderer={(item, index) => (
                <div key={`${item.term}-${index}`}>
                  <p className="font-semibold text-white">{item.term}</p>
                  <p className="text-sm text-slate-300">{item.meaning}</p>
                </div>
              )}
            />
          ) : null}

          {data?.formulas ? (
            <ListSection
              title="Formulas"
              items={data.formulas}
              itemRenderer={(item, index) => (
                <div key={`${item.name}-${index}`}>
                  <p className="font-semibold text-white">{item.name}</p>
                  <p className="text-sm text-brand-200">{item.formula}</p>
                  <p className="text-sm text-slate-300">{item.explanation}</p>
                </div>
              )}
            />
          ) : null}

          {data?.mcqs ? (
            <ListSection
              title="MCQs"
              items={data.mcqs}
              itemRenderer={(item, index) => (
                <div key={`${item.question}-${index}`} className="rounded-2xl bg-white/5 p-4">
                  <p className="font-semibold text-white">
                    {index + 1}. {item.question}
                  </p>
                  <ul className="mt-3 space-y-1 text-sm text-slate-300">
                    {item.options?.map((option) => <li key={option}>{option}</li>)}
                  </ul>
                  <p className="mt-3 text-sm text-brand-200">Answer: {item.answer}</p>
                  <p className="mt-2 text-sm text-slate-400">{item.explanation}</p>
                </div>
              )}
            />
          ) : null}

          {data?.flashcards ? (
            <ListSection
              title="Flashcards"
              items={data.flashcards}
              itemRenderer={(item, index) => (
                <div key={`${item.question}-${index}`} className="rounded-2xl bg-white/5 p-4">
                  <p className="font-semibold text-white">{item.question}</p>
                  <p className="mt-2 text-sm text-slate-300">{item.answer}</p>
                </div>
              )}
            />
          ) : null}

          {data?.beginner || data?.intermediate || data?.advanced ? (
            <div className="grid gap-4 lg:grid-cols-3">
              {["beginner", "intermediate", "advanced"].map((level) => (
                <ListSection
                  key={level}
                  title={level}
                  items={data[level]}
                  itemRenderer={(item, index) => (
                    <div key={`${level}-${index}`} className="rounded-2xl bg-white/5 p-3 text-sm text-slate-300">
                      {typeof item === "string" ? item : `${item.question} ${item.answer ? `- ${item.answer}` : ""}`}
                    </div>
                  )}
                />
              ))}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default AnalysisPanel;
