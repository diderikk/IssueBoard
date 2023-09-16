class CreateUsers1IssueBoards < ActiveRecord::Migration[6.1]
  def change
    create_table :issue_boards_users1, id: false do |t|
      t.belongs_to :user, null: false, foreign_key: { to_table: 'users1' }
      t.belongs_to :issue_board, null: false, foreign_key: "issue_board_id"

      t.timestamps
    end
  end
end
