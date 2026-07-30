using Microsoft.EntityFrameworkCore;

/// <summary>
/// Generic async CRUD base. Write methods persist internally so callers never invoke
/// SaveChanges separately. Generic over the DbContext (not coupled to a concrete context).
///
/// Async notes:
///   - Inserts use EF's AddAsync/AddRangeAsync + SaveChangesAsync.
///   - Deletes use ExecuteDeleteAsync (SQL-level, async, no Remove/SaveChanges).
///   - Updates use Update/UpdateRange (sync change-tracking — EF has no async overload)
///     followed by async SaveChangesAsync. Generic ExecuteUpdateAsync would require
///     per-property SetProperty expressions, which is intentionally avoided here.
/// </summary>
public abstract class RepositoryBase<TContext>(TContext context) where TContext : DbContext
{
  protected TContext Context => context;

  // ---------------------------------------------------------------------
  // Single
  // ---------------------------------------------------------------------

  protected async Task<(bool Success, TEntity Entity)> AddAsync<TEntity>(TEntity entity, CancellationToken cancellationToken = default)
      where TEntity : class
  {
    if (entity is null) return (false, null!);

    await context.Set<TEntity>().AddAsync(entity, cancellationToken);
    await context.SaveChangesAsync(cancellationToken);
    return (true, entity);
  }

  protected async Task<(bool Success, TEntity Entity)> UpdateAsync<TEntity>(TEntity entity, CancellationToken cancellationToken = default)
      where TEntity : class
  {
    if (entity is null) return (false, null!);

    context.Set<TEntity>().Update(entity);
    await context.SaveChangesAsync(cancellationToken);
    return (true, entity);
  }

  protected async Task<bool> DeleteByIdAsync<TEntity>(object id, CancellationToken cancellationToken = default)
      where TEntity : class
  {
    if (id is null) return false;

    var rows = await DeleteByIdsAsync<TEntity>(new object[] { id }, cancellationToken);
    return rows > 0;
  }

  protected async Task<TEntity?> FindAsync<TEntity>(object id, CancellationToken cancellationToken = default)
      where TEntity : class
  {
    if (id is null) return null;

    return await context.Set<TEntity>().FindAsync(new object[] { id }, cancellationToken);
  }

  // ---------------------------------------------------------------------
  // Bulk
  // ---------------------------------------------------------------------

  protected async Task<(bool Success, IEnumerable<TEntity> Entities)> AddRangeAsync<TEntity>(IEnumerable<TEntity> entities, CancellationToken cancellationToken = default)
      where TEntity : class
  {
    if (entities is null) return (false, null!);

    await context.AddRangeAsync(entities, cancellationToken);
    await context.SaveChangesAsync(cancellationToken);
    return (true, entities);
  }

  protected async Task<(bool Success, IEnumerable<TEntity> Entities)> UpdateRangeAsync<TEntity>(IEnumerable<TEntity> entities, CancellationToken cancellationToken = default)
      where TEntity : class
  {
    if (entities is null) return (false, null!);

    context.Set<TEntity>().UpdateRange(entities);
    await context.SaveChangesAsync(cancellationToken);
    return (true, entities);
  }

  protected async Task<int> DeleteByIdsAsync<TEntity>(IEnumerable<object> ids, CancellationToken cancellationToken = default)
      where TEntity : class
  {
    if (ids is null) return 0;

    var idList = ids.ToList();
    if (idList.Count == 0) return 0;

    var pkName = GetPrimaryKeyName<TEntity>();

    return await context.Set<TEntity>()
        .Where(e => idList.Contains(EF.Property<object>(e, pkName)))
        .ExecuteDeleteAsync(cancellationToken);
  }

  // ---------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------

  private string GetPrimaryKeyName<TEntity>() where TEntity : class
  {
    var pk = context.Model.FindEntityType(typeof(TEntity))?.FindPrimaryKey();
    if (pk is null || pk.Properties.Count != 1)
      throw new InvalidOperationException(
          $"'{typeof(TEntity).Name}' must have a single-column primary key for generic delete-by-id.");

    return pk.Properties[0].Name;
  }
}