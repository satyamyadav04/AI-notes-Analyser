const SearchPanel = ({ query, onQueryChange, onSearch, results }) => (
  <div className="glass-panel p-5">
    <div className="flex flex-col gap-3 md:flex-row">
      <input
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        placeholder="Search concepts inside this note..."
        className="input-field"
      />
      <button type="button" onClick={onSearch} className="primary-button">
        Search Notes
      </button>
    </div>

    {results ? (
      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
          <h4 className="font-semibold text-white">Keyword Search</h4>
          <div className="mt-3 space-y-3">
            {results.keywordResults?.length ? (
              results.keywordResults.map((result, index) => (
                <div key={`${result.documentId}-${index}`} className="rounded-2xl bg-white/5 p-3 text-sm text-slate-300">
                  {result.excerpt}
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">No direct keyword matches found.</p>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
          <h4 className="font-semibold text-white">Semantic Search</h4>
          <div className="mt-3 space-y-3">
            {results.semanticResults?.length ? (
              results.semanticResults.map((result, index) => (
                <div key={`${result.metadata?.chunkId}-${index}`} className="rounded-2xl bg-white/5 p-3 text-sm text-slate-300">
                  {result.content}
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">No semantic matches yet for this note.</p>
            )}
          </div>
        </div>
      </div>
    ) : null}
  </div>
);

export default SearchPanel;
